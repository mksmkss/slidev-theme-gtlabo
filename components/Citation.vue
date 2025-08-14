<template>
  <span>
    <!-- インライン引用番号 -->
    <sup class="text-blue-600 font-semibold">
      [{{ citationNumber }}]
    </sup>
    
    <!-- 指定されたidの引用情報のみ表示（画面下部に表示） -->
    <div 
      v-if="citationData && shouldShowCitation"
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
    activeCitation: null, // 現在表示中の引用id
    components: new Set()
  }
}

const forceUpdate = ref(0)
const isVisible = ref(false)

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

// フォーマットされた引用情報
const formattedCitation = computed(() => {
  if (!citationData.value) return '引用情報が見つかりません'
  
  if (window.citationManager.citations.has(props.id)) {
    return window.citationManager.citations.get(props.id).formatted
  }
  
  return formatCitation(citationData.value)
})

// この引用を表示すべきかどうか
const shouldShowCitation = computed(() => {
  forceUpdate.value // 依存関係を強制的に更新
  return window.citationManager.activeCitation === props.id && isVisible.value
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

// この引用をアクティブにする
const setActiveCitation = () => {
  window.citationManager.activeCitation = props.id
  isVisible.value = true
  triggerGlobalUpdate()
}

// この引用を非アクティブにする
const clearActiveCitation = () => {
  if (window.citationManager.activeCitation === props.id) {
    window.citationManager.activeCitation = null
    isVisible.value = false
    triggerGlobalUpdate()
  }
}

// マウスイベントハンドラー
const handleMouseEnter = () => {
  setActiveCitation()
}

const handleMouseLeave = () => {
  // 少し遅延を入れて、マウスが引用情報エリアに移動する時間を確保
  setTimeout(() => {
    clearActiveCitation()
  }, 100)
}

// ページ変更を監視（ページが変わったら引用を非表示）
watch(currentPage, () => {
  clearActiveCitation()
})

// コンポーネントのマウント時
onMounted(() => {
  window.citationManager.components.add({ updateForceUpdate })
  
  // インライン引用番号にマウスイベントを追加
  const supElement = document.querySelector(`sup:has([data-citation-id="${props.id}"])`)
  if (supElement) {
    supElement.addEventListener('mouseenter', handleMouseEnter)
    supElement.addEventListener('mouseleave', handleMouseLeave)
  }
})

// コンポーネントのアンマウント時
onUnmounted(() => {
  window.citationManager.components.delete({ updateForceUpdate })
  clearActiveCitation()
  
  // イベントリスナーを削除
  const supElement = document.querySelector(`sup:has([data-citation-id="${props.id}"])`)
  if (supElement) {
    supElement.removeEventListener('mouseenter', handleMouseEnter)
    supElement.removeEventListener('mouseleave', handleMouseLeave)
  }
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

/* インライン引用番号のホバー効果 */
sup {
  cursor: pointer;
  transition: all 0.2s ease;
}

sup:hover {
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 2px;
  padding: 1px 2px;
}
</style>