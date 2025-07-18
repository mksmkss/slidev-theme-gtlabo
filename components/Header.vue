<template>
  <div class="flex flex-col px-4 -mx-3 -mt-4  mb-2">
    <div class="flex ">
      <div class="flex flex-col gap-y-2 w-11/12">
        <!-- プログレス部分 -->
        <div class="flex items-center gap-2 overflow-x-auto">
          <div 
            v-for="(chapter, index) in displayChapterList" 
            :key="chapter.key"
            class="flex flex-col items-center min-w-35 py-1"
          >
            <!-- 章タイトル -->
            <div class="flex flex-1 text-md font-semibold text-gray-800 text-left w-full whitespace-nowrap mb-2">
              {{ chapter.title }}
            </div>
                    
            <!-- 進捗バー -->
            <div class="flex flex-1 w-full">
              <!-- セクションが複数ある場合 -->
              <div 
                v-if="chapter.sections.length > 0"
                class="flex w-full h-1 gap-0.8 rounded-full overflow-hidden"
              >
                <div 
                  v-for="(section, sectionIndex) in chapter.sections" 
                  :key="sectionIndex"
                  class="flex-1 h-full transition-all duration-200 ease-in-out cursor-help rounded-full"
                  :class="{ 
                    'bg-gray-700': isCompleted(index, sectionIndex),
                    'bg-blue-500': isCurrent(index, sectionIndex),
                    'bg-gray-300': !isCompleted(index, sectionIndex) && !isCurrent(index, sectionIndex)
                  }"
                  :style="{ 
                    width: getSectionWidth(chapter.sections.length) + '%'
                  }"
                  :title="getSectionTitle(chapter, sectionIndex)"
                />
              </div>
              
              <!-- セクションがない場合（1節のみ） -->
              <div 
                v-else
                class="flex w-full h-1 bg-gray-300 rounded-full overflow-hidden"
              >
                <div 
                  class="flex-1 h-full transition-all duration-200 ease-in-out cursor-help"
                  :class="{ 
                    'bg-gray-700': isCompleted(index, 0),
                    'bg-blue-500': isCurrent(index, 0),
                    'bg-gray-300': !isCompleted(index, 0) && !isCurrent(index, 0)
                  }"
                  :title="chapter.title"
                />
              </div>
            </div>
                    
            <!-- 章間の接続線（最後の章以外） -->
            <div 
              v-if="index < displayChapterList.length - 1"
              class="text-gray-400 transition-colors duration-200 mx-1"
              :class="{ 'text-gray-700': isChapterCompleted(index) }"
            />
          </div>
        </div>
            
        <!-- タイトル部分 -->
        <div class="flex flex-col justify-center items-left">
          <p
            v-if="displayData"
            class="text-4xl font-bold text-slate-800 inline-block py-4 "
          >
            {{ displayData.title }}
          </p>
          <p
            v-else
            class="text-4xl font-bold text-slate-800 inline-block py-4 bg-amber"
          >
            {{ isSection ? 'セクションが見つかりません' : '章が見つかりません' }}
          </p>
        </div>
      </div>
      
      <!-- ページカウンター -->
      <div class="flex w-1/12 items-center justify-center text-gray-800">
        <div class="border-3 border-stone-800 rounded-md flex flex-col w-14 divide-y-2 divide-stone-800">
          <div class="flex flex-1 justify-center items-center text-4xl font-bold">
            {{ adjustedCurrentPage }}
          </div>
          <div class="flex flex-1 justify-center items-center text-xl font-semibold max-h-6">
            {{ adjustedTotal }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-4/5 bg-sky-600 h-1.5 rounded-full -mx-6 " />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// Slidevコンテキストからconfigsにアクセス
const { $slidev } = useSlideContext()
const chapters = $slidev.configs.chapters || {}

const props = defineProps({
  // タイトル用のプロパティ
  chapter: {
    type: String,
    required: false
  },
  chapterData: {
    type: Object,
    required: false
  },
  currentSection: {
    type: String,
    required: false
  },
  // プログレス用のプロパティ（タイトル用と共通利用）
  currentChapter: {
    type: String,
    required: false,
    default: null
  }
})

// セクションかどうかを判定
const isSection = computed(() => {
  return !!props.currentSection
})

// タイトル表示用のデータ
const displayData = computed(() => {
  // chapterDataが直接渡された場合はそれを使用
  if (props.chapterData) {
    return props.chapterData
  }
  
  // currentSectionが指定されている場合、セクションデータを取得
  if (props.currentSection && (props.chapter || props.currentChapter)) {
    const chapterKey = props.chapter || props.currentChapter
    const chapterData = chapters[chapterKey]
    if (chapterData?.sections?.[props.currentSection]) {
      return chapterData.sections[props.currentSection]
    }
    return null
  }
  
  // chapterキーが渡された場合は内部データから取得
  const chapterKey = props.chapter || props.currentChapter
  if (chapterKey && chapters[chapterKey]) {
    return chapters[chapterKey]
  }
  
  // どちらも渡されなかった場合はnull
  return null
})

// 参考文献ページかどうかを判定
const isReferencePage = computed(() => {
  const currentChapterKey = props.currentChapter || props.chapter
  return currentChapterKey === 'ref'
})

// 現在のページがappendixかどうかを判定
const isCurrentPageAppendix = computed(() => {
  const currentChapterKey = props.currentChapter || props.chapter
  return currentChapterKey && currentChapterKey.startsWith('ap')
})

// 章リストを生成（refを除外し、appendixの表示を条件分岐）
const chapterList = computed(() => {
  if (!chapters || typeof chapters !== 'object') {
    return []
  }
  
  return Object.keys(chapters)
    .filter(chapterKey => chapterKey !== 'ref') // refを除外
    .map(chapterKey => {
      const chapter = chapters[chapterKey]
      const sections = chapter?.sections || {}
      const sectionKeys = Object.keys(sections)
      
      return {
        key: chapterKey,
        title: chapter?.title || `章 ${chapterKey}`,
        sections: sectionKeys,
        sectionData: sections,
        isAppendix: chapterKey.startsWith('ap')
      }
    })
})

// 表示する章リスト（appendixページかどうかで切り替え）
const displayChapterList = computed(() => {
  if (isCurrentPageAppendix.value) {
    // appendixページの場合はappendixのみ表示
    return chapterList.value.filter(chapter => chapter.isAppendix)
  } else {
    // 通常ページの場合はappendixを除外
    return chapterList.value.filter(chapter => !chapter.isAppendix)
  }
})

// appendixの開始ページを計算
const appendixStartPage = computed(() => {
  const totalPages = $slidev.nav.total
  const appendixChapters = chapterList.value.filter(chapter => chapter.isAppendix)
  
  console.log('appendixStartPage計算:')
  console.log('  totalPages:', totalPages)
  console.log('  appendixChapters:', appendixChapters)
  
  if (appendixChapters.length === 0) {
    console.log('  appendixなし - 結果:', totalPages + 1)
    return totalPages + 1 // appendixがない場合は存在しないページ番号を返す
  }
  
  // appendixの実際のセクション数を計算
  const appendixSectionCount = appendixChapters.reduce((total, chapter) => {
    const sectionCount = Math.max(1, chapter.sections.length)
    console.log(`  章${chapter.key}: ${sectionCount}セクション`)
    return total + sectionCount
  }, 0)
  
  console.log('  appendixSectionCount:', appendixSectionCount)
  const result = totalPages - appendixSectionCount + 1
  console.log('  appendixあり - 結果:', result)
  return result
})

// 調整されたページ総数（常にappendix前まで、appendixがない場合は全体から表紙を除く）
const adjustedTotal = computed(() => {
  // chapterList（全体）からappendixを検索
  const appendixChapters = chapterList.value.filter(chapter => chapter.isAppendix)
  
  // デバッグ用ログ
  console.log('全chapterList:', chapterList.value)
  console.log('appendixChapters:', appendixChapters)
  console.log('appendixChapters.length:', appendixChapters.length)
  console.log('$slidev.nav.total:', $slidev.nav.total)
  console.log('appendixStartPage.value:', appendixStartPage.value)
  
  if (appendixChapters.length === 0) {
    // appendixがない場合は全体のページ数から表紙を除く
    console.log('appendixなし - 計算結果:', $slidev.nav.total - 1)
    return $slidev.nav.total - 1
  } else {
    // appendixがある場合はappendix開始前のページ数から表紙を除く
    console.log('appendixあり - 計算結果:', appendixStartPage.value - 2)
    return appendixStartPage.value - 2
  }
})

// 表紙を除いた現在のページ番号
const adjustedCurrentPage = computed(() => {
  return Math.max(1, $slidev.nav.currentPage - 1)
})

// 現在の章のインデックスを取得（表示リスト内での位置）
const currentChapterIndex = computed(() => {
  const currentChapterKey = props.currentChapter || props.chapter
  if (!currentChapterKey) return -1
  return displayChapterList.value.findIndex(chapter => chapter.key === currentChapterKey)
})

// 現在の節のインデックスを取得
const currentSectionIndex = computed(() => {
  const currentChapterKey = props.currentChapter || props.chapter
  if (!currentChapterKey || !props.currentSection) return -1
  const chapter = displayChapterList.value[currentChapterIndex.value]
  if (!chapter) return -1
  return chapter.sections.findIndex(section => section === props.currentSection)
})

// セクションタイトルを取得（ツールチップ用）
const getSectionTitle = (chapter, sectionIndex) => {
  if (chapter.sections.length === 0) {
    return chapter.title
  }
  const sectionKey = chapter.sections[sectionIndex]
  const sectionData = chapter.sectionData[sectionKey]
  return sectionData?.title || `セクション ${sectionIndex + 1}`
}

// セクションの幅を計算（%）
const getSectionWidth = (totalSections) => {
  if (totalSections <= 1) return 100
  return 100 / totalSections
}

// 指定されたセクションが完了しているかチェック
const isCompleted = (chapterIndex, sectionIndex) => {
  // 参考文献ページの場合はすべて完了状態
  if (isReferencePage.value) {
    return true
  }
  
  const currentIdx = currentChapterIndex.value
  const currentSecIdx = currentSectionIndex.value
  
  if (currentIdx === -1) return false
  
  // 現在の章より前の章はすべて完了
  if (chapterIndex < currentIdx) return true
  
  // 現在の章の場合
  if (chapterIndex === currentIdx) {
    // セクションが指定されている場合
    if (currentSecIdx >= 0) {
      return sectionIndex < currentSecIdx
    }
    // セクションが指定されていない場合は何も完了していない
    return false
  }
  
  return false
}

// 指定されたセクションが現在の位置かチェック
const isCurrent = (chapterIndex, sectionIndex) => {
  // 参考文献ページの場合は何も現在位置にしない（すべて完了状態）
  if (isReferencePage.value) {
    return false
  }
  
  const currentIdx = currentChapterIndex.value
  const currentSecIdx = currentSectionIndex.value
  
  if (currentIdx === -1) return false
  if (chapterIndex !== currentIdx) return false
  
  // セクションが指定されている場合
  if (currentSecIdx >= 0) {
    return sectionIndex === currentSecIdx
  }
  
  // セクションが指定されていない場合は最初のセクションが現在位置
  return sectionIndex === 0
}

// 章全体が完了しているかチェック
const isChapterCompleted = (chapterIndex) => {
  // 参考文献ページの場合はすべて完了状態
  if (isReferencePage.value) {
    return true
  }
  
  const currentIdx = currentChapterIndex.value
  return currentIdx > chapterIndex
}
</script>