<!-- components/SectionDivider.vue -->
<template>
  <div class="table-of-contents-container flex flex-col justify-start bg-white overflow-hidden relative">
    <!-- 厳密な背景グリッド - Swiss Styleの基礎 -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-10" 
         style="background-image: linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px); background-size: 50px 50px;">
    </div>

    <!-- 非対称の幾何学的構成要素 - 左上の強調 -->
    <div class="absolute top-0 left-0 w-2 h-32 bg-slate-900 z-5"></div>
    <div class="absolute top-0 left-0 w-32 h-2 bg-slate-900 z-5"></div>
    
    <!-- 非対称の幾何学的構成要素 - 右下のアクセント -->
    <div class="absolute bottom-0 right-0 w-48 h-2 bg-slate-900 z-5"></div>
    <div class="absolute bottom-12 right-0 w-1 h-48 bg-slate-900 opacity-30 z-5"></div>

    <!-- 右側の装飾バー群 - cover.vueと同じスタイル -->
    <div class="absolute right-0 top-0 w-1/4 h-full z-0 pointer-events-none">
      <div class="absolute right-0 top-0 w-full h-full bg-slate-50" />
      <div class="absolute right-[15%] top-0 w-32 h-[35%] bg-sky-600/10" />
      <div class="absolute right-0 bottom-0 w-2 h-[40%] bg-slate-900" />
    </div>

    <!-- 機能的なsky-500のアクセントブロック -->
    <div class="absolute right-0 top-1/4 w-[12%] h-24 bg-sky-500/30 z-5"></div>

    <!-- ヘッダー - 付録セクション用 -->
    <div
      v-if="isAppendixSection"
      :class="headerClasses"
      class="relative z-10"
    >
      <div class="flex items-start space-x-6">
        <div :class="headerTitleClasses" class="font-bold uppercase tracking-widest text-slate-800 leading-none">
          APPENDIX
        </div>
      </div>
    </div>
      
    <!-- メインコンテンツ - 厳密なグリッドベース -->
    <div :class="mainContentClasses" class="relative z-10">
      <div class="max-w-full w-full">
        <!-- 通常の目次表示 -->
        <div
          v-if="!isAppendixSection"
          :class="layoutClasses"
        >
          <div 
            v-for="(chapter, index) in regularChapters" 
            :key="chapter.key"
            class="flex flex-col break-inside-avoid"
            :class="[
              isNextChapter(chapter.key) ? 'border-sky-500 border-l-8 pl-6' : 'border-slate-200 border-l-4 pl-7',
              itemMarginBottomClasses
            ]"
          >
            <!-- 次の章インジケーター - sky-500アクセント -->
            <div 
              v-if="isNextChapter(chapter.key)"
              :class="nextBadgeClasses"
              class="bg-sky-500 text-white font-bold uppercase tracking-widest leading-none"
            >
              NEXT
            </div>
                  
            <!-- 章番号とタイトル - 左揃え、明確なヒエラルキー -->
            <div :class="chapterHeaderClasses">
              <div class="flex items-end space-x-3 w-full">
                <div :class="chapterNumberClasses" class="flex text-slate-900 font-bold tabular-nums leading-none">
                  {{ String(index + 1).padStart(2, '0') }}
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
        </div>
      
        <!-- 付録の目次表示 -->
        <div
          v-else
          :class="layoutClasses"
        >
          <div 
            v-for="(chapter, index) in appendixChapters" 
            :key="chapter.key"
            class="flex flex-col break-inside-avoid"
            :class="[
              isNextChapter(chapter.key) ? 'border-sky-500  border-l-8 pl-6' : 'border-slate-200 border-l-4 pl-7',
              itemMarginBottomClasses
            ]"
          >
            <!-- 次の章インジケーター -->
            <div 
              v-if="isNextChapter(chapter.key)"
              :class="nextBadgeClasses"
              class="bg-sky-500 text-white font-bold uppercase tracking-widest leading-none"
            >
              NEXT
            </div>
                  
            <!-- 付録番号とタイトル -->
             <div :class="chapterHeaderClasses">
              <div class="flex items-end space-x-3 w-full">
                <div :class="chapterNumberClasses" class="flex text-slate-900 font-bold tabular-nums leading-none">
                  A{{ index + 1 }}
                </div>
                <div class="flex-1">
                  <div class="border-b border-slate-900 mb-2">
                    <span :class="chapterTitleClasses" class="text-slate-900 font-bold leading-none">
                      {{ chapter.title }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
                  
            <!-- セクション一覧 -->
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
        </div>
      </div>
    </div>

    <!-- タイポグラフィックな署名 - 客観性の表明 -->
    <div class="absolute bottom-4 left-6 text-[10px] font-mono text-slate-800 uppercase tracking-widest z-20">
      CONTENTS
    </div>
  </div>
</template>
      
<script setup>
import { computed, inject } from 'vue'
import { useSlideContext } from '@slidev/client'

// Slidevコンテキストからconfigsにアクセス
const { $slidev } = useSlideContext()

// 方法1: frontmatterから取得（従来通り）
const frontmatterChapters = $slidev.configs.chapters || {}

// 方法2: injectから取得（外部ファイル対応）
const injectedChapters = inject('chapters', {})

// 両方をマージ（frontmatter優先）
const chapters = computed(() => ({
  ...injectedChapters,
  ...frontmatterChapters
}))

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
  const chaptersData = chapters.value
  const chapter = chaptersData[chapterKey]
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
  const chaptersData = chapters.value
  if (!chaptersData || typeof chaptersData !== 'object') {
    return []
  }
  
  return Object.keys(chaptersData)
    .filter(chapterKey => chapterKey !== 'ref' && !chapterKey.startsWith('ap'))
    .map(chapterKey => {
      const chapter = chaptersData[chapterKey]
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
  const chaptersData = chapters.value
  if (!chaptersData || typeof chaptersData !== 'object') {
    return []
  }
  
  return Object.keys(chaptersData)
    .filter(chapterKey => chapterKey.startsWith('ap'))
    .map(chapterKey => {
      const chapter = chaptersData[chapterKey]
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
  const chaptersData = chapters.value
  const chapter = chaptersData[chapterKey]
  const sectionData = chapter?.sections?.[sectionKey]
  return sectionData?.title || `セクション ${sectionKey}`
}

// 次の章かどうかを判定
const isNextChapter = (chapterKey) => {
  return props.nextChapter === chapterKey
}

// サイズ設定 - 縦幅を大幅削減
const sizeConfigs = {
  xs: {
    columns: "columns-4",
    headerPadding: 'pt-3 pb-1 px-6',
    headerTitle: 'text-lg',
    mainPadding: 'px-6 py-6',
    columnGap: 'gap-4',
    itemMarginBottom: 'mb-4',
    chapterNumber: 'text-2xl',
    chapterTitle: 'text-[11px]',
    chapterHeader: 'mb-2',
    sectionList: 'mt-2 space-y-1',
    sectionText: 'text-[9px]',
    appendixNumber: 'text-xl',
    nextBadge: 'mb-2 px-1.5 py-0.5 text-[8px]'
  },
  sm: {
    columns: "columns-3",
    headerPadding: 'pt-6 pb-2 px-8',
    headerTitle: 'text-xl',
    mainPadding: 'px-8 py-8',
    columnGap: 'gap-6',
    itemMarginBottom: 'mb-5',
    chapterNumber: 'text-3xl',
    chapterTitle: 'text-xs',
    chapterHeader: 'mb-2.5',
    sectionList: 'mt-2.5 space-y-1',
    sectionText: 'text-[10px]',
    appendixNumber: 'text-2xl',
    nextBadge: 'mb-2.5 px-2 py-0.5 text-[9px]'
  },
  md: {
    columns: "columns-2",
    headerPadding: 'pt-12 px-12',
    headerTitle: 'text-3xl',
    mainPadding: 'px-12 py-14',
    columnGap: 'gap-12',
    itemMarginBottom: 'mb-6',
    chapterNumber: 'text-6xl',
    chapterTitle: 'text-2xl',
    chapterHeader: 'mb-3',
    sectionList: 'mt-3 space-y-1.5',
    sectionText: 'text-lg',
    appendixNumber: 'text-4xl',
    nextBadge: 'mb-3 px-2.5 py-1 text-md'
  },
  lg: {
    columns: "columns-2",
    headerPadding: 'pt-8 pb-4 px-16',
    headerTitle: 'text-4xl',
    mainPadding: 'px-16 py-18',
    columnGap: 'gap-16',
    itemMarginBottom: 'mb-8',
    chapterNumber: 'text-7xl',
    chapterTitle: 'text-xl',
    chapterHeader: 'mb-4',
    sectionList: 'mt-4 space-y-2',
    sectionText: 'text-base',
    appendixNumber: 'text-5xl',
    nextBadge: 'mb-4 px-3 py-1.5 text-xs'
  },
  xl: {
    columns: "columns-1",
    headerPadding: 'pt-10 pb-5 px-20',
    headerTitle: 'text-6xl',
    mainPadding: 'px-20 py-24',
    columnGap: 'gap-20',
    itemMarginBottom: 'mb-12',
    chapterNumber: 'text-8xl',
    chapterTitle: 'text-3xl',
    chapterHeader: 'mb-6',
    sectionList: 'mt-6 space-y-3',
    sectionText: 'text-xl',
    appendixNumber: 'text-7xl',
    nextBadge: 'mb-6 px-4 py-2 text-sm'
  }
}

const currentConfig = computed(() => sizeConfigs[props.size])

// 動的クラス
const headerClasses = computed(() => `text-left ${currentConfig.value.headerPadding}`)
const headerTitleClasses = computed(() => currentConfig.value.headerTitle)
const mainContentClasses = computed(() => `flex-1 ${currentConfig.value.mainPadding}`)
const layoutClasses = computed(() => `${currentConfig.value.columns} ${currentConfig.value.columnGap} block`)
const itemMarginBottomClasses = computed(() => currentConfig.value.itemMarginBottom)
const chapterHeaderClasses = computed(() => currentConfig.value.chapterHeader)
const chapterNumberClasses = computed(() => currentConfig.value.chapterNumber)
const chapterTitleClasses = computed(() => currentConfig.value.chapterTitle)
const sectionListClasses = computed(() => currentConfig.value.sectionList)
const sectionTextClasses = computed(() => currentConfig.value.sectionText)
const appendixNumberClasses = computed(() => currentConfig.value.appendixNumber)
const nextBadgeClasses = computed(() => currentConfig.value.nextBadge)
</script>

<style scoped>
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

/* タイポグラフィの最適化 - Swiss Styleの核心 */
div, span, h2, p {
  font-feature-settings: "palt", "kern";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* タブラーナンバーの最適化 */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>