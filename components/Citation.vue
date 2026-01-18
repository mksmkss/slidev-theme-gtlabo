<template>
  <span>
    <!-- インライン引用番号 -->
    <sup class="text-blue-600 font-semibold cursor-help" :title="formattedCitation">
      [{{ citationNumber }}]
    </sup>
  </span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, inject } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev, $page } = useSlideContext()

// 方法1: frontmatterから取得（従来通り）
const frontmatterCitations = $slidev.configs.citations || {}

// 方法2: injectから取得（外部ファイル対応）
const injectedCitations = inject('citations', {})

// 両方をマージ（frontmatter優先）
const citations = computed(() => ({
  ...injectedCitations,
  ...frontmatterCitations
}))

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// グローバル引用管理の初期化
if (!window.citationManager) {
  window.citationManager = {
    citations: new Map(),           // id -> { number, data, formatted }
    citationKeys: [],               // frontmatterのキーの順番
    pageCitations: new Map(),       // pageNumber -> Set of citation ids
    initialized: false,
    listeners: new Set()            // 更新通知用リスナー
  }
}

// 更新を通知する関数
const notifyListeners = () => {
  window.citationManager.listeners.forEach(listener => {
    try {
      listener()
    } catch (e) {
      // リスナーエラーを無視
    }
  })
}

// frontmatterの順番でcitation番号を事前に割り当て
const initializeCitations = () => {
  if (!window.citationManager.initialized) {
    window.citationManager.citationKeys = Object.keys(citations)
    
    window.citationManager.citationKeys.forEach((key, index) => {
      if (!window.citationManager.citations.has(key)) {
        const data = citations[key]
        const newCitation = {
          number: index + 1,
          data: data,
          formatted: formatCitation(data)
        }
        window.citationManager.citations.set(key, newCitation)
      }
    })
    
    window.citationManager.initialized = true
  }
}

// 引用データを取得
const citationData = computed(() => {
  return citations[props.id] || null
})

// 引用番号を取得
const citationNumber = computed(() => {
  if (!citationData.value) {
    return '?'
  }
  
  initializeCitations()
  
  const citation = window.citationManager.citations.get(props.id)
  if (citation) {
    return citation.number
  }
  
  return '?'
})

// フォーマットされた引用テキスト
const formattedCitation = computed(() => {
  if (!citationData.value) {
    return '引用情報が見つかりません'
  }
  
  const citation = window.citationManager.citations.get(props.id)
  if (citation && citation.formatted) {
    return citation.formatted
  }
  
  return formatCitation(citationData.value)
})

// 引用をフォーマット
const formatCitation = (data) => {
  if (!data) {
    return '引用情報が見つかりません'
  }
  
  let citation = ''
  
  if (data.author) {
    citation += data.author
  }
  
  if (data.title) {
    citation += citation ? `, "${data.title}"` : `"${data.title}"`
  }
  
  if (data.journal) {
    citation += citation ? `, ${data.journal}` : data.journal
  }
  
  if (data.volume && data.number) {
    citation += `, Vol. ${data.volume}, No. ${data.number}`
  } else if (data.volume) {
    citation += `, Vol. ${data.volume}`
  } else if (data.number) {
    citation += `, No. ${data.number}`
  }
  
  if (data.pages) {
    citation += `, pp. ${data.pages}`
  }
  
  if (data.year) {
    citation += citation ? ` (${data.year})` : data.year
  }
  
  if (data.publisher) {
    citation += citation ? `, ${data.publisher}` : data.publisher
  }
  
  if (data.url) {
    citation += citation ? `, ${data.url}` : data.url
  }
  
  if (data.issn) {
    citation += `, ISSN: ${data.issn}`
  }
  
  return citation || '引用情報が不完全です'
}

// 現在のページに引用を登録
const registerCitation = () => {
  // $page はこのコンポーネントが配置されているスライドの番号（静的）
  const page = $page
  if (!page) return
  
  if (!window.citationManager.pageCitations.has(page)) {
    window.citationManager.pageCitations.set(page, new Set())
  }
  
  const pageSet = window.citationManager.pageCitations.get(page)
  if (!pageSet.has(props.id)) {
    pageSet.add(props.id)
    notifyListeners()
  }
}

// 現在のページから引用を解除
const unregisterCitation = () => {
  const page = $page
  if (!page) return
  
  const pageSet = window.citationManager.pageCitations.get(page)
  if (pageSet) {
    pageSet.delete(props.id)
    if (pageSet.size === 0) {
      window.citationManager.pageCitations.delete(page)
    }
    notifyListeners()
  }
}

onMounted(() => {
  initializeCitations()
  registerCitation()
})

onUnmounted(() => {
  unregisterCitation()
})
</script>

<style scoped>
sup {
  font-size: 0.75em;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
  top: -0.5em;
}
</style>