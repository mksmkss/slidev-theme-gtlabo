<template>
  <span class="eq-ref cursor-help" :title="tooltipText">({{ displayNumber }})</span>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const equationRegistry = inject('equationRegistry', null)

const displayNumber = computed(() => {
  if (!equationRegistry) return '?'
  const num = equationRegistry.getNumber(props.id)
  return num ?? '?'
})

const tooltipText = computed(() => {
  return `式 (${displayNumber.value})`
})
</script>

<style scoped>
.eq-ref {
  color: #2563eb;
  font-weight: 500;
}
</style>