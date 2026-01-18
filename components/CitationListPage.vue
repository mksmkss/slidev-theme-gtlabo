<template>
  <div class="h-full flex flex-col">
    <!-- ヘッダー部分（Headerコンポーネントを使用） -->
    <Header 
      :chapter-data="{ title: '参考文献' }"
      chapter="ref"
    />
  
    <!-- 参考文献リスト -->
    <div class="flex-1 overflow-y-auto px-6 py-2">
      <div
        v-if="citationsList.length > 0"
        class="space-y-3"
      >
        <div 
          v-for="(citation, index) in citationsList" 
          :key="citation.key"
          class="citation-item border-l-2 border-sky-400 pl-3 py-1"
        >
          <!-- 引用番号（frontmatterの順番に基づく） -->
          <div :class="numberSizeClass">
            [{{ citation.number }}]
          </div>
            
          <!-- 引用情報 -->
          <div :class="textSizeClass">
            <!-- 著者 -->
            <span
              v-if="citation.data.author"
              class="font-medium"
            >
              {{ citation.data.author }}
            </span>
              
            <!-- タイトル -->
            <span
              v-if="citation.data.title"
              class="italic"
            >
              <span v-if="citation.data.author">. </span>
              "{{ citation.data.title }}"
            </span>
              
            <!-- 雑誌名 -->
            <span
              v-if="citation.data.journal"
              class="font-medium"
            >
              <span v-if="citation.data.title || citation.data.author">. </span>
              <em>{{ citation.data.journal }}</em>
            </span>
              
            <!-- 巻号 -->
            <span v-if="citation.data.volume">
              <span v-if="citation.data.journal">, </span>
              Vol. {{ citation.data.volume }}
            </span>
              
            <span v-if="citation.data.number">
              <span v-if="citation.data.volume">, </span>
              <span v-else-if="citation.data.journal">, </span>
              No. {{ citation.data.number }}
            </span>
              
            <!-- ページ -->
            <span v-if="citation.data.pages">
              <span v-if="citation.data.volume || citation.data.number">, </span>
              <span v-else-if="citation.data.journal">, </span>
              pp. {{ citation.data.pages }}
            </span>
              
            <!-- 出版社 -->
            <span v-if="citation.data.publisher">
              <span v-if="citation.data.journal || citation.data.pages">, </span>
              {{ citation.data.publisher }}
            </span>
              
            <!-- 年 -->
            <span
              v-if="citation.data.year"
              class="font-medium"
            >
              <span v-if="citation.data.author || citation.data.title || citation.data.journal || citation.data.publisher">, </span>
              ({{ citation.data.year }})
            </span>
              
            <!-- DOI -->
            <div
              v-if="citation.data.doi"
              :class="linkSizeClass"
            >
              DOI: <a
                :href="`https://doi.org/${citation.data.doi}`"
                target="_blank"
                class="hover:underline"
              >
                {{ citation.data.doi }}
              </a>
            </div>
              
            <!-- URL -->
            <div
              v-if="citation.data.url && !citation.data.doi"
              :class="linkSizeClass"
            >
              URL: <a
                :href="citation.data.url"
                target="_blank"
                class="hover:underline break-all"
              >
                {{ citation.data.url }}
              </a>
            </div>
              
            <!-- ISSN -->
            <div
              v-if="citation.data.issn"
              :class="linkSizeClass"
            >
              ISSN: {{ citation.data.issn }}
            </div>
          </div>
        </div>
      </div>
        
      <!-- 参考文献がない場合 -->
      <div
        v-else
        class="text-center text-gray-500 mt-12"
      >
        <div class="text-lg">
          参考文献が設定されていません
        </div>
        <div class="text-xs mt-2">
          frontmatterの<code class="bg-gray-200 px-1 py-0.5 rounded text-xs">citations</code>セクションに参考文献を追加してください
        </div>
      </div>
    </div>
      
    <!-- フッター（必要に応じて） -->
    <div class="flex-shrink-0 mt-4 pt-2 border-t border-gray-300 px-6">
      <div :class="footerSizeClass">
        {{ citationsList.length }} 件の参考文献
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { computed, inject } from 'vue'
import { useSlideContext } from '@slidev/client'

// Slidevコンテキストからconfigsにアクセス
const { $slidev } = useSlideContext()

// 方法1: frontmatterから取得（従来通り）
const frontmatterCitations = $slidev.configs.citations || {}

// 方法2: injectから取得（外部ファイル対応）
const injectedCitations = inject('citations', {})

// 両方をマージ（frontmatter優先）
const citations = computed(() => ({
  ...injectedCitations,
  ...frontmatterCitations
}))

// プロパティ定義
const props = defineProps({
  // 表示スタイルのカスタマイズ用
  style: {
    type: String,
    default: 'academic', // 'academic', 'ieee', 'apa' など
  },
  // 表示順序
  sortBy: {
    type: String,
    default: 'frontmatter', // 'frontmatter', 'key', 'author', 'year' など
  },
  // 文字サイズ
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
    description: '文字サイズ（xs, sm, md, lg, xl）'
  }
})

// 参考文献リストを生成（frontmatterの順番を維持）
const citationsList = computed(() => {
  const citationsData = citations.value
  if (!citationsData || typeof citationsData !== 'object') {
    return []
  }
  
  // frontmatterの記述順でキーを取得
  const originalKeys = Object.keys(citationsData)
  
  const list = originalKeys.map((key, index) => ({
    key,
    data: citationsData[key],
    number: index + 1 // frontmatterの順番に基づく番号
  }))
  
  // ソート処理
  switch (props.sortBy) {
    case 'author':
      return list.sort((a, b) => {
        const authorA = a.data.author || ''
        const authorB = b.data.author || ''
        return authorA.localeCompare(authorB)
      })
    case 'year':
      return list.sort((a, b) => {
        const yearA = parseInt(a.data.year) || 0
        const yearB = parseInt(b.data.year) || 0
        return yearB - yearA // 降順（新しい順）
      })
    case 'key':
      return list.sort((a, b) => a.key.localeCompare(b.key))
    case 'frontmatter':
    default:
      // frontmatterの順番を維持（デフォルト）
      return list
  }
})

// 文字サイズのクラス
const sizeMap = {
  xs: {
    number: 'text-xs font-semibold text-sky-700 mb-0.5',
    text: 'text-[10px] text-gray-700 leading-relaxed',
    link: 'mt-0.5 text-[9px] text-blue-600',
    footer: 'text-[10px] text-gray-600 text-center'
  },
  sm: {
    number: 'text-xs font-semibold text-sky-700 mb-0.5',
    text: 'text-xs text-gray-700 leading-relaxed',
    link: 'mt-0.5 text-[10px] text-blue-600',
    footer: 'text-xs text-gray-600 text-center'
  },
  md: {
    number: 'text-sm font-semibold text-sky-700 mb-1',
    text: 'text-xs text-gray-700 leading-relaxed',
    link: 'mt-1 text-xs text-blue-600',
    footer: 'text-xs text-gray-600 text-center'
  },
  lg: {
    number: 'text-base font-semibold text-sky-700 mb-1',
    text: 'text-sm text-gray-700 leading-relaxed',
    link: 'mt-1 text-sm text-blue-600',
    footer: 'text-sm text-gray-600 text-center'
  },
  xl: {
    number: 'text-lg font-semibold text-sky-700 mb-1.5',
    text: 'text-base text-gray-700 leading-relaxed',
    link: 'mt-1.5 text-base text-blue-600',
    footer: 'text-base text-gray-600 text-center'
  }
}

const numberSizeClass = computed(() => sizeMap[props.size].number)
const textSizeClass = computed(() => sizeMap[props.size].text)
const linkSizeClass = computed(() => sizeMap[props.size].link)
const footerSizeClass = computed(() => sizeMap[props.size].footer)
</script>
  
<style scoped>
.citation-item {
  transition: all 0.2s ease-in-out;
}

.citation-item:hover {
  background-color: rgba(14, 165, 233, 0.05);
  border-left-width: 3px;
}

/* スクロールバーのスタイリング */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(14, 165, 233, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(14, 165, 233, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(14, 165, 233, 0.5);
}

/* コードブロックのスタイル */
code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>