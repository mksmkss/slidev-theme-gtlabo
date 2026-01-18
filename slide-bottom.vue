<!-- slide-bottom.vue -->
<template>
  <div 
    v-if="currentCitations.length > 0"
    class="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 shadow-sm z-40"
  >
    <div class="max-w-7xl mx-auto px-4 py-2">
      <div class="space-y-1">
        <div 
          v-for="citation in currentCitations" 
          :key="citation.id"
          class="text-xs text-gray-700 leading-relaxed"
        >
          <span class="font-semibold text-blue-600">[{{ citation.number }}]</span>
          <span class="ml-1">{{ citation.formatted }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted, isRef } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev, $page } = useSlideContext()

// $page を数値として取得するヘルパー
const getPageNumber = () => {
  if (isRef($page)) {
    return $page.value
  }
  return $page
}

// 方法1: frontmatterから取得（従来通り）
const frontmatterCitations = $slidev.configs.citations || {}

// 方法2: injectから取得（外部ファイル対応）
const injectedCitations = inject('citations', {})

// 両方をマージ（frontmatter優先）
const citations = computed(() => ({
  ...injectedCitations,
  ...frontmatterCitations
}))

// リアクティブな更新トリガー
const updateTrigger = ref(0)

// ページごとの引用管理の初期化
if (!window.pageCitations) {
  window.pageCitations = {
    data: new Map(),
    listeners: new Set()
  }
}

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

// 引用番号を取得
const getCitationNumber = (id) => {
  const citationsData = citations.value
  if (!citationsData) return '?'
  
  const keys = Object.keys(citationsData)
  const index = keys.indexOf(id)
  
  return index >= 0 ? index + 1 : '?'
}

// 現在のページの引用リストを取得
const currentCitations = computed(() => {
  // updateTriggerを参照して再計算をトリガー
  const _ = updateTrigger.value
  // citationsも参照してリアクティブにする
  const citationsData = citations.value
  
  const page = getPageNumber()
  
  if (!page || !window.pageCitations?.data?.has(page)) {
    return []
  }
  
  const pageSet = window.pageCitations.data.get(page)
  const citationList = []
  
  pageSet.forEach(id => {
    const data = citationsData[id]
    if (data) {
      citationList.push({
        id: id,
        number: getCitationNumber(id),
        formatted: formatCitation(data)
      })
    }
  })
  
  // 引用番号でソート
  citationList.sort((a, b) => a.number - b.number)
  
  return citationList
})

// 更新リスナー
const handleUpdate = () => {
  updateTrigger.value++
}

onMounted(() => {
  window.pageCitations.listeners.add(handleUpdate)
  
  // 初期表示のために少し遅延して更新
  setTimeout(() => {
    updateTrigger.value++
  }, 100)
})

onUnmounted(() => {
  window.pageCitations.listeners.delete(handleUpdate)
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