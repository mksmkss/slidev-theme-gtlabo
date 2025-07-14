<template>
  <!-- セクション区切り用の目次ページ -->
  <TableOfContents 
    :next-chapter="nextChapter"
    :current-chapter="currentChapter"
  />
</template>
  
<script setup>
import TableOfContents from './TableOfContents.vue'

const props = defineProps({
nextChapter: {
    type: String,
    required: true,
    description: '次に始まる章のキー（例: "c2", "c3", "ap1"）'
},
currentChapter: {
    type: String,
    required: false,
    description: '現在の章のキー（進捗表示用）'
}
})
</script>