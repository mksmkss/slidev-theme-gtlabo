<template>
  <h1 class="font-normal pb-2 border-b border-gray-200">{{ index + 1 }}. {{ sections[index] }}</h1>
</template>

<script setup>
import { sections } from '../../composables/sections'

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
})
</script>