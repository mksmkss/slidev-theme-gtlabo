<template>
  <span>
    <!-- インライン引用番号 -->
    <sup class="text-blue-600 font-semibold cursor-help" :title="formattedCitation">
      [{{ citationNumber }}]
    </sup>
  </span>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'
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

// ページごとの引用管理（slide-bottom.vue用）
if (!window.pageCitations) {
  window.pageCitations = {
    data: new Map(),  // pageNumber -> Set of citation ids
    listeners: new Set()
  }
}

const notifyListeners = () => {
  window.pageCitations.listeners.forEach(listener => {
    try { listener() } catch (e) { /* ignore */ }
  })
}

// 引用データを取得
const citationData = computed(() => {
  return citations.value[props.id] || null
})

// 引用番号を取得（シンプル版：毎回計算）
const citationNumber = computed(() => {
  const citationsData = citations.value
  if (!citationsData || !citationData.value) {
    return '?'
  }
  
  const keys = Object.keys(citationsData)
  const index = keys.indexOf(props.id)
  
  if (index >= 0) {
    return index + 1
  }
  
  return '?'
})

// フォーマットされた引用テキスト
const formattedCitation = computed(() => {
  if (!citationData.value) {
    return '引用情報が見つかりません'
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

// 現在のページに引用を登録（slide-bottom.vue用）
const registerCitation = () => {
  const page = $page
  if (!page) return
  
  if (!window.pageCitations.data.has(page)) {
    window.pageCitations.data.set(page, new Set())
  }
  
  const pageSet = window.pageCitations.data.get(page)
  if (!pageSet.has(props.id)) {
    pageSet.add(props.id)
    notifyListeners()
  }
}

// 現在のページから引用を解除
const unregisterCitation = () => {
  const page = $page
  if (!page) return
  
  const pageSet = window.pageCitations.data.get(page)
  if (pageSet) {
    pageSet.delete(props.id)
    if (pageSet.size === 0) {
      window.pageCitations.data.delete(page)
    }
    notifyListeners()
  }
}

onMounted(() => {
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