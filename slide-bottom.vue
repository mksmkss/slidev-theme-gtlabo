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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev, $page } = useSlideContext()
const citations = $slidev.configs.citations || {}

// リアクティブな更新トリガー
const updateTrigger = ref(0)

// グローバル引用管理の初期化（Citation.vueと同じ構造）
if (!window.citationManager) {
  window.citationManager = {
    citations: new Map(),
    citationKeys: [],
    pageCitations: new Map(),
    initialized: false,
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

// frontmatterの順番で引用番号を初期化
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

// 現在のページの引用リストを取得
// $page を使用（このslide-bottomが属するスライドの番号）
const currentCitations = computed(() => {
  // updateTriggerを参照して再計算をトリガー
  const _ = updateTrigger.value
  
  // $pageはこのslide-bottomインスタンスが属するスライド番号
  const page = $page
  
  if (!page || !window.citationManager.pageCitations.has(page)) {
    return []
  }
  
  const pageSet = window.citationManager.pageCitations.get(page)
  const citationList = []
  
  pageSet.forEach(id => {
    const citation = window.citationManager.citations.get(id)
    if (citation) {
      citationList.push({
        id: id,
        number: citation.number,
        formatted: citation.formatted
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
  initializeCitations()
  window.citationManager.listeners.add(handleUpdate)
  
  // 初期表示のために少し遅延して更新
  setTimeout(() => {
    updateTrigger.value++
  }, 50)
})

onUnmounted(() => {
  window.citationManager.listeners.delete(handleUpdate)
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