<template>
  <sup class="text-blue-600 font-semibold">
    [{{ citationNumber }}]
  </sup>
</template>

<script setup lang="ts">
import { citationsData } from '../../composables/citations'
import { onMounted } from 'vue';

interface Props {
  id: string
}

const props = defineProps<Props>()

const citationKeys = Object.keys(citationsData)
const citationNumber = citationKeys.indexOf(props.id) + 1

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (!window.citationManager) {
      window.citationManager = {
        citations: new Map(),
        citationKeys: citationKeys
      }

      citationKeys.forEach((key, index) => {
        window.citationManager.citations.set(key, index + 1)
      })
    }
  }
})

declare global {
  interface Window {
    citationManager: {
      citations: Map<string, number>
      citationKeys: string[]
    }
  }
}
</script>
