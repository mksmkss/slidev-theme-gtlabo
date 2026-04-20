<!-- AlertBox.vue -->
<template>
  <div :class="[
    'border-l-8 p-3 shadow-md rounded-r-lg gap-4 flex items-center',
    variants[variant].bg,
    variants[variant].border,
  ]">
    <div :class="['w-10 h-10 flex-shrink-0 ml-2', variants[variant].iconColor]">
      <slot name="icon">
        <lucide-frown v-if="variant === 'warning'" class="w-10 h-10" />
        <lucide-lightbulb v-else-if="variant === 'info'" class="w-10 h-10" />
        <lucide-circle-check v-else-if="variant === 'success'" class="w-10 h-10" />
        <lucide-search-check v-else-if="variant === 'result'" class="w-10 h-10" />
        <lucide-circle-x v-else class="w-10 h-10" />
      </slot>
    </div>
    <div class="text-2xl font-bold text-slate-800 leading-relaxed">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'warning',
  },
})

const variants = {
  warning: {
    bg: 'bg-slate-50',
    border: 'border-slate-600',
    iconColor: 'text-red-500',
  },
  info: {
    bg: 'bg-gradient-to-r from-slate-50 to-white',
    border: 'border-indigo-600',
    iconColor: 'text-yellow-500',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-600',
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-600',
    iconColor: 'text-red-500',
  },
  result: {
    bg: 'bg-gradient-to-r from-slate-50 to-white',
    border: 'border-indigo-600',
    iconColor: 'text-green-500',
  },
}
</script>