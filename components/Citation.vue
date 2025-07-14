<template>
  <span>
    <!-- インライン引用番号 -->
    <sup class="text-blue-600 font-semibold">
      [{{ citationNumber }}]
    </sup>
    
    <!-- 引用情報表示エリア（画面下部に常時表示） -->
    <div 
      v-if="hasCurrentPageCitations"
      class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-lg z-40 max-h-32 overflow-y-auto"
      style="pointer-events: none;"
    >
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="space-y-1">
          <div 
            v-for="citation in sortedCurrentPageCitations" 
            :key="citation.id"
            class="text-xs text-gray-800"
          >
            <span class="font-semibold">[{{ citation.number }}]</span>
            {{ citation.formatted }}
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()
const citations = $slidev.configs.citations || {}

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// グローバル引用管理の初期化
if (!window.citationManager) {
  window.citationManager = {
    counter: 1,
    citations: new Map(), // id -> { number, data, formatted }
    pageActiveCitations: new Map(), // pageNumber -> Set(citationIds)
    components: new Set()
  }
}

const forceUpdate = ref(0)

// 現在のページ番号を取得
const currentPage = computed(() => {
  return $slidev.nav.currentPage
})

// 引用データを取得
const citationData = computed(() => {
  return citations[props.id] || null
})

// 引用番号を取得または生成
const citationNumber = computed(() => {
  if (!citationData.value) return '?'
  
  if (!window.citationManager.citations.has(props.id)) {
    window.citationManager.citations.set(props.id, {
      number: window.citationManager.counter,
      data: citationData.value,
      formatted: formatCitation(citationData.value)
    })
    window.citationManager.counter++
  }
  
  return window.citationManager.citations.get(props.id).number
})

// 現在のページにアクティブな引用があるかチェック
const hasCurrentPageCitations = computed(() => {
  forceUpdate.value // 依存関係を強制的に更新
  const pageSet = window.citationManager.pageActiveCitations.get(currentPage.value)
  return pageSet && pageSet.size > 0
})

// 現在のページのソートされた引用一覧
const sortedCurrentPageCitations = computed(() => {
  forceUpdate.value // 依存関係を強制的に更新
  const pageSet = window.citationManager.pageActiveCitations.get(currentPage.value)
  
  if (!pageSet) return []
  
  return Array.from(pageSet)
    .map(id => ({
      id,
      ...window.citationManager.citations.get(id)
    }))
    .filter(citation => citation.data) // dataが存在するもののみ
    .sort((a, b) => a.number - b.number)
})

// 引用をフォーマット
const formatCitation = (data) => {
  if (!data) return '引用情報が見つかりません'
  
  let citation = ''
  
  // 著者
  if (data.author) {
    citation += data.author
  }
  
  // タイトル
  if (data.title) {
    citation += citation ? `, "${data.title}"` : `"${data.title}"`
  }
  
  // ジャーナル
  if (data.journal) {
    citation += citation ? `, ${data.journal}` : data.journal
  }
  
  // ボリューム・ナンバー
  if (data.volume && data.number) {
    citation += `, Vol. ${data.volume}, No. ${data.number}`
  } else if (data.volume) {
    citation += `, Vol. ${data.volume}`
  } else if (data.number) {
    citation += `, No. ${data.number}`
  }
  
  // ページ
  if (data.pages) {
    citation += `, pp. ${data.pages}`
  }
  
  // 年
  if (data.year) {
    citation += citation ? ` (${data.year})` : data.year
  }
  
  // 出版社
  if (data.publisher) {
    citation += citation ? `, ${data.publisher}` : data.publisher
  }
  
  // URL
  if (data.url) {
    citation += citation ? `, ${data.url}` : data.url
  }
  
  // ISSN
  if (data.issn) {
    citation += `, ISSN: ${data.issn}`
  }
  
  return citation || '引用情報が不完全です'
}

// 全コンポーネントの再描画をトリガー
const triggerGlobalUpdate = () => {
  window.citationManager.components.forEach(component => {
    if (component.updateForceUpdate) {
      component.updateForceUpdate()
    }
  })
}

// 強制更新関数
const updateForceUpdate = () => {
  forceUpdate.value++
}

// 現在のページに引用を追加
const addToCurrentPage = () => {
  if (!citationData.value) return
  
  const page = currentPage.value
  if (!window.citationManager.pageActiveCitations.has(page)) {
    window.citationManager.pageActiveCitations.set(page, new Set())
  }
  window.citationManager.pageActiveCitations.get(page).add(props.id)
}

// 現在のページから引用を削除
const removeFromCurrentPage = () => {
  const page = currentPage.value
  const pageSet = window.citationManager.pageActiveCitations.get(page)
  if (pageSet) {
    pageSet.delete(props.id)
    if (pageSet.size === 0) {
      window.citationManager.pageActiveCitations.delete(page)
    }
  }
}

// ページ変更を監視
watch(currentPage, (newPage, oldPage) => {
  if (oldPage !== undefined) {
    // 前のページから削除
    const oldPageSet = window.citationManager.pageActiveCitations.get(oldPage)
    if (oldPageSet) {
      oldPageSet.delete(props.id)
      if (oldPageSet.size === 0) {
        window.citationManager.pageActiveCitations.delete(oldPage)
      }
    }
  }
  
  // 新しいページに追加
  addToCurrentPage()
  triggerGlobalUpdate()
})

// コンポーネントのマウント時
onMounted(() => {
  if (citationData.value) {
    addToCurrentPage()
    window.citationManager.components.add({ updateForceUpdate })
    triggerGlobalUpdate()
  }
})

// コンポーネントのアンマウント時
onUnmounted(() => {
  removeFromCurrentPage()
  window.citationManager.components.delete({ updateForceUpdate })
  triggerGlobalUpdate()
})
</script>

<style scoped>
/* スクロールバーのスタイリング */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>