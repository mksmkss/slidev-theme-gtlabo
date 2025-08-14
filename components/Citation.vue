<template>
  <span>
    <!-- インライン引用番号 -->
    <sup class="text-blue-600 font-semibold">
      [{{ citationNumber }}]
    </sup>
    
    <!-- このコンポーネント専用の引用情報表示エリア -->
    <div 
      v-if="shouldShowCitation"
      class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-lg z-40 max-h-32 overflow-y-auto"
      style="pointer-events: none;"
    >
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="space-y-1">
          <div class="text-xs text-gray-800">
            <span class="font-semibold">[{{ citationNumber }}]</span>
            {{ formattedCitation }}
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()
const citations = $slidev.configs.citations || {}

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// グローバル引用管理の初期化（引用番号のみ管理）
if (!window.citationManager) {
  window.citationManager = {
    counter: 1,
    citations: new Map() // id -> { number, data, formatted }
  }
}

const isMounted = ref(false)

// 現在のページ番号を取得
const currentPage = computed(() => {
  const page = $slidev.nav.currentPage
  return page
})

// 引用データを取得
const citationData = computed(() => {
  const data = citations[props.id] || null
  return data
})

// 引用番号を取得または生成
const citationNumber = computed(() => {
  if (!citationData.value) {
    return '?'
  }
  
  if (!window.citationManager.citations.has(props.id)) {
    const newCitation = {
      number: window.citationManager.counter,
      data: citationData.value,
      formatted: formatCitation(citationData.value)
    }
    window.citationManager.citations.set(props.id, newCitation)
    window.citationManager.counter++
  }
  
  const citation = window.citationManager.citations.get(props.id)
  return citation.number
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

// 引用を表示すべきかどうか
const shouldShowCitation = computed(() => {
  const shouldShow = isMounted.value && citationData.value !== null
  
  return shouldShow
})

// 引用をフォーマット
const formatCitation = (data) => {
  if (!data) {
    return '引用情報が見つかりません'
  }
  
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
  
  const formatted = citation || '引用情報が不完全です'
  
  return formatted
}

// 全体のグローバル状態をデバッグ出力
const debugGlobalState = () => {
}

// コンポーネントのマウント時
onMounted(() => {
  
  isMounted.value = true
  
  if (citationData.value) {
    // 引用番号を生成（副作用でglobal stateに保存される）
    const _ = citationNumber.value
    debugGlobalState()
  } else {
  }
})

// コンポーネントのアンマウント時
onUnmounted(() => {
  
  isMounted.value = false
  debugGlobalState()
})

// 開発用：グローバル状態確認用の関数をwindowに追加
if (typeof window !== 'undefined') {
  window.debugCitationState = debugGlobalState
}
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