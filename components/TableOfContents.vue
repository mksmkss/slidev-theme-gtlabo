<template>
  <div class="table-of-contents-container flex flex-col justify-center bg-theme-color">
    <!-- ヘッダー -->
    <div
      v-if="isAppendixSection"
      :class="headerClasses"
    >
      <p :class="headerTitleClasses">
        付録
      </p>
    </div>
      
    <!-- メインコンテンツ -->
    <div :class="mainContentClasses">
      <div class="max-w-full w-full">
        <!-- 通常の目次表示 -->
        <div
          v-if="!isAppendixSection"
          :class="gridClasses"
        >
          <div 
            v-for="(chapter, index) in regularChapters" 
            :key="chapter.key"
            class="flex flex-col"
            :class="{ 'relative': isNextChapter(chapter.key) }"
          >
            <!-- 次の章の強調表示 -->
            <div 
              v-if="isNextChapter(chapter.key)"
              :class="highlightBorderClasses"
            />
            <div 
              v-if="isNextChapter(chapter.key)"
              :class="nextBadgeClasses"
            >
              NEXT
            </div>
                  
            <!-- 章番号とタイトル -->
            <div :class="chapterHeaderClasses">
              <div :class="chapterNumberClasses">
                {{ String(index + 1).padStart(2, '0') }}
              </div>
              <div class="flex-1 border-b border-white pb-2">
                <span :class="chapterTitleClasses">
                  {{ chapter.title }}
                </span>
              </div>
            </div>
                  
            <!-- セクション一覧（重複除去済み） -->
            <div :class="sectionListClasses">
              <div 
                v-for="(sectionData, sectionIndex) in chapter.uniqueSections" 
                :key="`${chapter.key}-${sectionIndex}`"
                :class="sectionItemClasses"
              >
                <span :class="sectionTextClasses">
                  {{ sectionData.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      
        <!-- 付録の目次表示 -->
        <div
          v-else
          :class="gridClasses"
        >
          <div 
            v-for="(chapter, index) in appendixChapters" 
            :key="chapter.key"
            class="flex flex-col"
            :class="{ 'relative': isNextChapter(chapter.key) }"
          >
            <!-- 次の章の強調表示 -->
            <div 
              v-if="isNextChapter(chapter.key)"
              :class="highlightBorderClasses"
            />
            <div 
              v-if="isNextChapter(chapter.key)"
              :class="nextBadgeClasses"
            >
              NEXT
            </div>
                  
            <!-- 付録番号とタイトル -->
            <div :class="chapterHeaderClasses">
              <div :class="appendixNumberClasses">
                A{{ index + 1 }}
              </div>
              <div class="flex-1 border-b border-white pb-2">
                <h2 :class="chapterTitleClasses">
                  {{ chapter.title }}
                </h2>
              </div>
            </div>
                  
            <!-- セクション一覧（重複除去済み） -->
            <div :class="sectionListClasses">
              <div 
                v-for="(sectionData, sectionIndex) in chapter.uniqueSections" 
                :key="`${chapter.key}-${sectionIndex}`"
                :class="sectionItemClasses"
              >
                <span :class="sectionTextClasses">
                  {{ sectionData.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// Slidevコンテキストからconfigsにアクセス
const { $slidev } = useSlideContext()
const chapters = $slidev.configs.chapters || {}

const props = defineProps({
  nextChapter: {
    type: String,
    required: true,
    description: '次に始まる章のキー'
  },
  currentChapter: {
    type: String,
    required: false,
    description: '現在の章のキー（進捗表示用）'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
    description: '目次のサイズ（xs, sm, md, lg, xl）'
  }
})

// セクションの重複を除去する関数
const getUniqueSections = (chapterKey) => {
  const chapter = chapters[chapterKey]
  if (!chapter?.sections) return []
  
  const sections = chapter.sections
  const sectionKeys = Object.keys(sections)
  const uniqueSections = []
  let previousTitle = null
  
  for (const sectionKey of sectionKeys) {
    const sectionData = sections[sectionKey]
    const currentTitle = sectionData?.title || `セクション ${sectionKey}`
    
    // 前のセクションと同じタイトルでない場合のみ追加
    if (currentTitle !== previousTitle) {
      uniqueSections.push({
        key: sectionKey,
        title: currentTitle,
        originalData: sectionData
      })
      previousTitle = currentTitle
    }
  }
  
  return uniqueSections
}

// 次の章が付録かどうかを判定
const isAppendixSection = computed(() => {
  return props.nextChapter.startsWith('ap')
})

// 通常の章リスト（refと付録を除外）
const regularChapters = computed(() => {
  if (!chapters || typeof chapters !== 'object') {
    return []
  }
  
  return Object.keys(chapters)
    .filter(chapterKey => chapterKey !== 'ref' && !chapterKey.startsWith('ap'))
    .map(chapterKey => {
      const chapter = chapters[chapterKey]
      const sections = chapter?.sections || {}
      const sectionKeys = Object.keys(sections)
      
      return {
        key: chapterKey,
        title: chapter?.title || `章 ${chapterKey}`,
        sections: sectionKeys,
        sectionData: sections,
        uniqueSections: getUniqueSections(chapterKey) // 重複除去済みセクション
      }
    })
})

// 付録の章リスト
const appendixChapters = computed(() => {
  if (!chapters || typeof chapters !== 'object') {
    return []
  }
  
  return Object.keys(chapters)
    .filter(chapterKey => chapterKey.startsWith('ap'))
    .map(chapterKey => {
      const chapter = chapters[chapterKey]
      const sections = chapter?.sections || {}
      const sectionKeys = Object.keys(sections)
      
      return {
        key: chapterKey,
        title: chapter?.title || `付録 ${chapterKey}`,
        sections: sectionKeys,
        sectionData: sections,
        uniqueSections: getUniqueSections(chapterKey) // 重複除去済みセクション
      }
    })
})

// セクションタイトルを取得
const getSectionTitle = (chapterKey, sectionKey) => {
  const chapter = chapters[chapterKey]
  const sectionData = chapter?.sections?.[sectionKey]
  return sectionData?.title || `セクション ${sectionKey}`
}

// 次の章かどうかを判定
const isNextChapter = (chapterKey) => {
  return props.nextChapter === chapterKey
}

// サイズ設定に基づく動的スタイル
const sizeConfigs = {
  xs: {
    columns: 4,
    headerPadding: 'pt-6 pb-3 px-4 ',
    headerTitle: 'text-2xl',
    mainPadding: 'px-4 py-4',
    gridGap: 'gap-x-4 gap-y-2',
    chapterNumber: 'text-2xl',
    chapterTitle: 'text-sm font-bold',
    chapterHeader: 'mb-1',
    sectionList: 'ml-8 space-y-0.5',
    sectionText: 'text-xs',
    appendixNumber: 'text-lg',
    nextBadge: 'px-1 py-0.5 text-xs'
  },
  sm: {
    columns: 3,
    headerPadding: 'pt-8 pb-4 px-6',
    headerTitle: 'text-3xl',
    mainPadding: 'px-6 py-6',
    gridGap: 'gap-x-6 gap-y-3',
    chapterNumber: 'text-3xl',
    chapterTitle: 'text-base',
    chapterHeader: 'mb-2',
    sectionList: 'ml-10 space-y-1',
    sectionText: 'text-sm',
    appendixNumber: 'text-2xl',
    nextBadge: 'px-2 py-1 text-xs'
  },
  md: {
    columns: 2,
    headerPadding: 'pt-14 pb-8 px-10',
    headerTitle: 'text-5xl',
    mainPadding: 'px-6 py-40',
    gridGap: 'gap-x-12 gap-y-2',
    chapterNumber: 'text-6xl',
    chapterTitle: 'text-2xl',
    chapterHeader: 'mb-4',
    sectionList: 'ml-20 space-y-2',
    sectionText: 'text-lg',
    appendixNumber: 'text-4xl',
    nextBadge: 'px-3 py-1 text-sm'
  },
  lg: {
    columns: 2,
    headerPadding: 'pt-16 pb-10 px-12',
    headerTitle: 'text-6xl',
    mainPadding: 'px-16 py-16',
    gridGap: 'gap-x-20 gap-y-10',
    chapterNumber: 'text-7xl',
    chapterTitle: 'text-3xl',
    chapterHeader: 'mb-6',
    sectionList: 'ml-24 space-y-3',
    sectionText: 'text-xl',
    appendixNumber: 'text-5xl',
    nextBadge: 'px-4 py-2 text-base'
  },
  xl: {
    columns: 1,
    headerPadding: 'pt-20 pb-12 px-16',
    headerTitle: 'text-8xl',
    mainPadding: 'px-20 py-20',
    gridGap: 'gap-x-24 gap-y-12',
    chapterNumber: 'text-9xl',
    chapterTitle: 'text-5xl',
    chapterHeader: 'mb-8',
    sectionList: 'ml-32 space-y-4',
    sectionText: 'text-3xl',
    appendixNumber: 'text-7xl',
    nextBadge: 'px-5 py-2 text-lg'
  }
}

const currentConfig = computed(() => sizeConfigs[props.size])

// 動的クラス
const headerClasses = computed(() => `text-left ${currentConfig.value.headerPadding}`)
const headerTitleClasses = computed(() => `${currentConfig.value.headerTitle} font-bold text-white`)
const mainContentClasses = computed(() => `flex-1 ${currentConfig.value.mainPadding}`)
const gridClasses = computed(() => `grid grid-cols-${currentConfig.value.columns} ${currentConfig.value.gridGap}`)
const chapterHeaderClasses = computed(() => `flex items-center ${currentConfig.value.chapterHeader} relative z-5`)
const chapterNumberClasses = computed(() => `${currentConfig.value.chapterNumber} font-bold text-white mr-2`)
const chapterTitleClasses = computed(() => `${currentConfig.value.chapterTitle} font-bold text-white`)
const sectionListClasses = computed(() => currentConfig.value.sectionList)
const sectionItemClasses = computed(() => 'flex items-start')
const sectionTextClasses = computed(() => `text-white ${currentConfig.value.sectionText} leading-relaxed`)
const appendixNumberClasses = computed(() => `${currentConfig.value.appendixNumber} font-bold text-white mr-6 pb-2`)
const highlightBorderClasses = computed(() => 'absolute -inset-2 border-4 border-yellow-400 rounded-lg opacity-80')
const nextBadgeClasses = computed(() => `absolute -top-2 -right-2 bg-yellow-400 text-black ${currentConfig.value.nextBadge} rounded-full font-bold z-10`)
</script>

<style>
/* このコンポーネント専用のスタイル */
.table-of-contents-container {
  /* ページ全体をカバーする背景 */
  position: absolute !important;
  top: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  z-index: 0 !important;
}

/* 背景色を確実に適用 */
.table-of-contents-container.bg-theme-color {
  background-color: rgba(2, 132, 199, 1) !important;
}
</style>