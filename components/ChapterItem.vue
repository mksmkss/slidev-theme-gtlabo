<!-- components/ChapterItem.vue -->
<template>
  <div 
    class="flex flex-col"
    :class="isNext ? 'border-sky-500 border-l-8 pl-6' : 'border-slate-200 border-l-4 pl-7'"
  >
    <!-- 次の章インジケーター - sky-500アクセント -->
    <div 
      v-if="isNext"
      :class="nextBadgeClasses"
      class="bg-sky-500 text-white font-bold uppercase tracking-widest leading-none"
    >
      NEXT
    </div>
          
    <!-- 章番号とタイトル - 左揃え、明確なヒエラルキー -->
    <div :class="chapterHeaderClasses">
      <div class="flex items-end space-x-3 w-full">
        <div :class="chapterNumberClasses" class="flex text-slate-900 font-bold tabular-nums leading-none">
          {{ chapterNumber }}
        </div>
        <div class="flex-1">
          <div class="border-b border-slate-900 mb-2">
            <span :class="chapterTitleClasses" class="text-slate-900 font-bold leading-tight">
              {{ chapter.title }}
            </span>
          </div>
        </div>
      </div>
    </div>
          
    <!-- セクション一覧 - 機能的な情報構造 -->
    <div :class="sectionListClasses">
      <div 
        v-for="(sectionData, sectionIndex) in chapter.uniqueSections" 
        :key="`${chapter.key}-${sectionIndex}`"
        class="flex items-start"
      >
        <span class="w-1 h-1 bg-slate-400 mr-2 mt-1.5 flex-shrink-0 rounded-full"></span>
        <span :class="sectionTextClasses" class="text-slate-600 leading-snug">
          {{ sectionData.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  chapter: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isNext: {
    type: Boolean,
    default: false
  },
  isAppendix: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md'
  },
  config: {
    type: Object,
    required: true
  }
})

// 章番号の生成（通常章は "01", "02"、付録は "A1", "A2"）
const chapterNumber = computed(() => {
  if (props.isAppendix) {
    return `A${props.index + 1}`
  }
  return String(props.index + 1).padStart(2, '0')
})

// 動的クラス
const chapterHeaderClasses = computed(() => props.config.chapterHeader)
const chapterNumberClasses = computed(() => props.config.chapterNumber)
const chapterTitleClasses = computed(() => props.config.chapterTitle)
const sectionListClasses = computed(() => props.config.sectionList)
const sectionTextClasses = computed(() => props.config.sectionText)
const nextBadgeClasses = computed(() => props.config.nextBadge)
</script>