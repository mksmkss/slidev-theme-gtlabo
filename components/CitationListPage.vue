<template>
  <div class="h-full flex flex-col">
    <!-- ヘッダー部分（Headerコンポーネントを使用） -->
    <Header 
      :chapter-data="{ title: '参考文献' }"
      chapter="ref"
    />
  
    <!-- 参考文献リスト -->
    <div class="flex-1 overflow-y-auto px-4">
      <div
        v-if="citationsList.length > 0"
        class="space-y-6"
      >
        <div 
          v-for="(citation, index) in citationsList" 
          :key="citation.key"
          class="citation-item border-l-4 border-sky-500 pl-6 py-2"
        >
          <!-- 引用キー -->
          <div class="text-lg font-semibold text-sky-700 mb-2">
            [{{ citation.key }}]
          </div>
            
          <!-- 引用情報 -->
          <div class="text-gray-800 leading-relaxed">
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
              class="mt-2 text-sm text-blue-600"
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
              class="mt-2 text-sm text-blue-600"
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
              class="mt-1 text-sm text-gray-600"
            >
              ISSN: {{ citation.data.issn }}
            </div>
          </div>
        </div>
      </div>
        
      <!-- 参考文献がない場合 -->
      <div
        v-else
        class="text-center text-gray-500 mt-16"
      >
        <div class="text-xl">
          参考文献が設定されていません
        </div>
        <div class="text-sm mt-2">
          frontmatterの<code class="bg-gray-200 px-2 py-1 rounded">citations</code>セクションに参考文献を追加してください
        </div>
      </div>
    </div>
      
    <!-- フッター（必要に応じて） -->
    <div class="flex-shrink-0 mt-8 pt-4 border-t border-gray-300 px-4">
      <div class="text-sm text-gray-600 text-center">
        {{ citationsList.length }} 件の参考文献
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { computed } from 'vue'
  import { useSlideContext } from '@slidev/client'
  // Headerコンポーネントをimport
  import Header from './Header.vue'
  
  // Slidevコンテキストからconfigsにアクセス
  const { $slidev } = useSlideContext()
  const citations = $slidev.configs.citations || {}
  
  // プロパティ定義（必要に応じて）
  const props = defineProps({
    // 表示スタイルのカスタマイズ用
    style: {
      type: String,
      default: 'academic', // 'academic', 'ieee', 'apa' など
    },
    // 表示順序
    sortBy: {
      type: String,
      default: 'key', // 'key', 'author', 'year' など
    }
  })
  
  // 参考文献リストを生成
  const citationsList = computed(() => {
    if (!citations || typeof citations !== 'object') {
      return []
    }
    
    const list = Object.keys(citations).map(key => ({
      key,
      data: citations[key]
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
      default:
        return list.sort((a, b) => a.key.localeCompare(b.key))
    }
  })
  
  // スタイル別のフォーマット関数（将来的な拡張用）
  const formatCitation = (citation, style = 'academic') => {
    // 現在は academic スタイルのみ実装
    // 将来的にIEEE、APA等のスタイルを追加可能
    return citation
  }
  </script>
  
  <style scoped>
  .citation-item {
    transition: all 0.2s ease-in-out;
  }
  
  .citation-item:hover {
    background-color: rgba(14, 165, 233, 0.05);
    border-left-width: 6px;
  }
  
  /* スクロールバーのスタイリング */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(14, 165, 233, 0.3) transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(14, 165, 233, 0.3);
    border-radius: 3px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgba(14, 165, 233, 0.5);
  }
  
  /* コードブロックのスタイル */
  code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
  </style>