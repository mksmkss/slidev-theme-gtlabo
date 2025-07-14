<template>
  <div class="flex items-center gap-4 my-2">
    <!-- 左側のバー -->
    <div 
      class="w-3 h-10 rounded-sm flex-shrink-0"
      :class="barColorClass"
      :style="customBarStyle"
    />
      
    <!-- タイトルテキスト -->
    <h2 
      class="text-5xl font-extrabold m-0 leading-tight tracking-wide"
      :class="textColorClass"
      :style="customTextStyle"
    >
      <!-- スロットがある場合はスロットを使用、ない場合はtitleプロパティを使用 -->
      <slot v-if="$slots.default" />
      <span v-else>{{ title }}</span>
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  color?: string
}>()

// UnoCSS用のカラークラス
const barColorClass = computed(() => {
  if (!props.color) return 'bg-sky-800'
  
  // UnoCSS/Tailwindのカラー名かチェック
  const colorPattern = /^(red|blue|green|yellow|purple|pink|indigo|cyan|teal|orange|amber|lime|emerald|sky|violet|fuchsia|rose|slate|gray|zinc|neutral|stone)(-\d{1,3})?$/
  
  if (colorPattern.test(props.color)) {
    return `bg-${props.color}`
  }
  
  // カスタムカラーの場合は空文字を返してstyleで適用
  return ''
})

const textColorClass = computed(() => {
  if (!props.color) return 'text-gray-900'
  
  // UnoCSS/Tailwindのカラー名かチェック
  const colorPattern = /^(red|blue|green|yellow|purple|pink|indigo|cyan|teal|orange|amber|lime|emerald|sky|violet|fuchsia|rose|slate|gray|zinc|neutral|stone)(-\d{1,3})?$/
  
  if (colorPattern.test(props.color)) {
    return `text-${props.color}`
  }
  
  // カスタムカラーの場合は空文字を返してstyleで適用
  return ''
})

// カスタムカラー用のスタイル
const customBarStyle = computed(() => {
  if (!props.color || barColorClass.value) return {}
  return { backgroundColor: props.color }
})

const customTextStyle = computed(() => {
  if (!props.color || textColorClass.value) return {}
  return { color: props.color }
})
</script>