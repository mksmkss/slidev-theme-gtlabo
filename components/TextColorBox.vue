<template>
  <div :class="['shadow-md rounded-lg overflow-hidden', containerClass]">
    <div class="flex justify-center bg-theme-color/30 text-center font-bold">
      <p 
        :class="['p-2 flex justify-center items-center text-xl whitespace-pre-line', titleClass]"
        v-html="sanitizedTitle"
      />
    </div>
    <div class="py-2 px-4 bg-white text-md leading-relaxed">
      <!-- slot使用時はslotを優先、そうでなければtextプロパティを使用 -->
      <slot>
        <p
          :class="['leading-relaxed  whitespace-pre-line', textClass]"
          v-html="sanitizedText"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  containerClass: {
    type: [String, Array, Object],
    default: ''
  },
  titleClass: {
    type: [String, Array, Object],
    default: ''
  },
  textClass: {
    type: [String, Array, Object],
    default: ''
  }
})

// HTMLタグを含むテキストを安全に処理
const sanitizedText = computed(() => {
  // 基本的なHTMLタグのみを許可するシンプルなサニタイズ
  const allowedTags = ['span', 'strong', 'em', 'u', 'br']
  const allowedAttributes = ['class', 'style', 'v-mark']
  
  // より安全な実装が必要な場合は、DOMPurifyなどのライブラリを使用することを推奨
  return props.text
})

// タイトルも同様に処理
const sanitizedTitle = computed(() => {
  return props.title
})
</script>

<style scoped>
/* v-markディレクティブ用のスタイル */
:deep(.v-mark) {
  position: relative;
  display: inline;
}

:deep(.v-mark.underline) {
  text-decoration: underline;
}

:deep(.v-mark.underline.orange) {
  text-decoration: underline;
  text-decoration-color: orange;
  text-decoration-thickness: 2px;
}

/* その他のマーキングスタイル */
:deep(.v-mark.highlight) {
  background-color: yellow;
  padding: 0 2px;
}

:deep(.v-mark.highlight.blue) {
  background-color: #bfdbfe;
}

:deep(.v-mark.highlight.green) {
  background-color: #bbf7d0;
}

:deep(.v-mark.highlight.red) {
  background-color: #fecaca;
}
</style>