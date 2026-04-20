<!-- HighlightText.vue として保存 -->
<template>
  <span :class="[
    'mx-1',
    'font-bold',
    variants[variant].text,
    variants[variant].decoration,
  ]">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'orange',
    validator: (v) => ['orange', 'indigo', 'red', 'green'].includes(v),
  },
})

const variants = {
  orange: {
    text: 'text-orange-700',
    decoration: 'border-b-4 border-orange-300',
  },
  indigo: {
    text: 'text-indigo-700',
    decoration: 'underline decoration-indigo-300 decoration-4 underline-offset-8',
  },
  red: {
    text: 'text-red-700',
    decoration: 'border-b-4 border-red-300',
  },
  green: {
    text: 'text-green-700',
    decoration: 'border-b-4 border-green-300',
  },
}
</script>