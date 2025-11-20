<template>
  <div>
    <h1 class="font-semibold border-b pb-2">目次</h1>
    <div v-for="(section, index) in sections" :key="index">
      <p class="text-xl font-semibold">
        <span class="inline-block w-8 text-left">{{ index + 1 }}.</span>
        {{ section }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { sections } from '../../composables/sections'
</script>