<template>
  <span>
    <sup v-if="citationStyle === 'numbered'"
         class="text-blue-600 font-semibold cursor-help"
         :title="formattedCitation">
      {{ displayText }}
    </sup>
    <span v-else
          class="text-blue-600 font-semibold cursor-help"
          :title="formattedCitation">
      {{ displayText }}
    </span>
  </span>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, isRef } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev, $page } = useSlideContext()

const getPageNumber = () => {
  if (isRef($page)) return $page.value
  return $page
}

const frontmatterCitations = $slidev.configs.citations || {}
const injectedCitations = inject('citations', {})
const citations = computed(() => ({
  ...injectedCitations,
  ...frontmatterCitations
}))

// slides.md の frontmatter から citationStyle を取得
const citationStyle = $slidev.configs.citationStyle || 'numbered'

const props = defineProps({
  id: { type: String, required: true }
})

if (!window.pageCitations) {
  window.pageCitations = {
    data: new Map(),
    listeners: new Set()
  }
}

const notifyListeners = () => {
  window.pageCitations.listeners.forEach(listener => {
    try { listener() } catch (e) {}
  })
}

const citationData = computed(() => citations.value[props.id] || null)

// 番号形式: [1]
const citationNumber = computed(() => {
  const citationsData = citations.value
  if (!citationsData || !citationData.value) return '?'
  const keys = Object.keys(citationsData)
  const index = keys.indexOf(props.id)
  return index >= 0 ? index + 1 : '?'
})

// APA インライン形式: (first_author, year)
const apaInline = computed(() => {
  if (!citationData.value) return '(?)'
  const firstAuthor = citationData.value.first_author || '?'
  const year = citationData.value.year || '?'
  return `(${firstAuthor}, ${year})`
})

// スタイルに応じて表示テキストを切り替え
const displayText = computed(() => {
  if (citationStyle === 'apa') return apaInline.value
  return `[${citationNumber.value}]`
})

const formattedCitation = computed(() => {
  if (!citationData.value) return '引用情報が見つかりません'
  return formatCitation(citationData.value)
})

const formatCitation = (data) => {
  if (!data) return '引用情報が見つかりません'
  let citation = ''
  if (data.author) citation += data.author
  if (data.title) citation += citation ? `, "${data.title}"` : `"${data.title}"`
  if (data.journal) citation += citation ? `, ${data.journal}` : data.journal
  if (data.volume && data.number) citation += `, Vol. ${data.volume}, No. ${data.number}`
  else if (data.volume) citation += `, Vol. ${data.volume}`
  else if (data.number) citation += `, No. ${data.number}`
  if (data.pages) citation += `, pp. ${data.pages}`
  if (data.year) citation += citation ? ` (${data.year})` : data.year
  if (data.publisher) citation += citation ? `, ${data.publisher}` : data.publisher
  if (data.url) citation += citation ? `, ${data.url}` : data.url
  if (data.issn) citation += `, ISSN: ${data.issn}`
  return citation || '引用情報が不完全です'
}

const registerCitation = () => {
  const page = getPageNumber()
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

const unregisterCitation = () => {
  const page = getPageNumber()
  if (!page) return
  const pageSet = window.pageCitations.data.get(page)
  if (pageSet) {
    pageSet.delete(props.id)
    if (pageSet.size === 0) window.pageCitations.data.delete(page)
    notifyListeners()
  }
}

onMounted(() => registerCitation())
onUnmounted(() => unregisterCitation())
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