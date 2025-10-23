<template>
  <div class="h-full flex flex-col">
    <!-- 参考文献リスト -->
    <div
      v-if="citationsList.length > 0"
      class="space-y-4"
    >
      <div
        v-for="(citation, index) in citationsList"
        :key="citation.key"
        class="flex gap-2"
      >
        <!-- 引用キー -->
        <div class="text-sm mb-1">
          [{{ index + 1 }}]
        </div>

        <!-- 引用情報 -->
        <div class="text-xs text-gray-800">
          <!-- 著者 -->
          <span v-if="citation.data.author">{{ citation.data.author }}</span>
          <!-- タイトル -->
          <span v-if="citation.data.title"><span v-if="citation.data.author">. </span>"{{ citation.data.title }}"</span>
          <!-- 雑誌名 -->
          <span v-if="citation.data.journal"><span v-if="citation.data.title || citation.data.author">. {{ citation.data.journal }}</span></span>
          <!-- 巻号 -->
          <span v-if="citation.data.volume"><span v-if="citation.data.journal">, </span>Vol. {{ citation.data.volume }}</span>
          <span v-if="citation.data.number"><span v-if="citation.data.volume">, </span><span v-else-if="citation.data.journal">, </span>No. {{ citation.data.number }}</span>
          <!-- ページ -->
          <span v-if="citation.data.pages"><span v-if="citation.data.volume || citation.data.number">, </span><span v-else-if="citation.data.journal">, </span>pp. {{ citation.data.pages }}</span>
          <!-- 出版社 -->
          <span v-if="citation.data.publisher"><span v-if="citation.data.journal || citation.data.pages">, </span>{{ citation.data.publisher }}</span>
          <!-- 年 -->
          <span v-if="citation.data.year"><span v-if="citation.data.author || citation.data.title || citation.data.journal || citation.data.publisher">, </span>({{ citation.data.year }})</span>
          <!-- DOI -->
          <div v-if="citation.data.doi" class="text-blue-500 mt-1"> DOI: <a :href="`https://doi.org/${citation.data.doi}`" target="_blank" class="hover:underline break-all">{{ citation.data.doi }}</a></div>
          <!-- URL -->
          <div v-if="citation.data.url && !citation.data.doi" class="text-blue-500 mt-1"> URL: <a :href="citation.data.url" target="_blank" class="hover:underline break-all">{{ citation.data.url }}</a></div>
          <!-- ISSN -->
          <span v-if="citation.data.issn" class="text-gray-500"> ISSN: {{ citation.data.issn }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { citationsData } from '../../composables/citations'

const citationKeys = Object.keys(citationsData)

const citationsList = citationKeys.map((key) => ({
  key,
  data: citationsData[key]
}))
</script>
