<template>
  <div class="flex items-center my-2 -ml-4">
    <!-- 左側のバー -->
    <lucide-chevron-right
      class="w-12 h-12 text-sky-700 -mr-1"
      :style="customBarStyle"
    />
      
    <!-- タイトルテキスト -->
    <h2 
      class="text-5xl font-extrabold m-0 leading-tight tracking-wide"
      :class="textColorClass"
      :style="customTextStyle"
    >
      {{ title }}
    </h2>
  </div>
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    title: string
    color?: string
  }>()
  
  // UnoCSS用のカラークラス
  const barColorClass = computed(() => {
    if (!props.color) return 'bg-sky-700'
    
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