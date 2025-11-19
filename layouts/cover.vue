<template>
  <div class="slidev-layout cover relative w-full h-full !p-0 bg-white overflow-hidden font-sans text-slate-900 selection:bg-sky-200 selection:text-sky-900">
    
    <div class="absolute inset-0 z-0 pointer-events-none opacity-10" 
         style="background-image: linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px); background-size: 50px 50px;">
    </div>

    <div class="absolute -top-[20%] -right-[10%] w-[80vh] h-[80vh] z-0 pointer-events-none opacity-20">
      <div class="absolute inset-0 border-3 border-dashed border-slate-700 rounded-full animate-spin-super-slow"></div>
      <div class="absolute inset-[15%] border-3 border-dotted border-sky-700 rounded-full animate-reverse-spin-slow"></div>

    </div>

    <div class="absolute bottom-[10%] left-[5%] w-32 h-32 z-0 pointer-events-none opacity-30">
       <svg class="w-full h-full animate-spin-slow text-sky-800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 4" />
         <rect x="49.5" y="10" width="1" height="80" fill="currentColor" />
         <rect x="10" y="49.5" width="80" height="1" fill="currentColor" />
       </svg>
    </div>
    <div class="absolute right-0 top-0 w-1/3 h-full z-0 pointer-events-none">
      <div 
        class="absolute right-0 top-0 w-full h-full bg-slate-50 transform origin-right transition-transform duration-[1500ms] ease-expo-out"
        :class="mounted ? 'scale-x-100' : 'scale-x-0'"
      />
      <div 
        class="absolute right-[15%] top-0 w-32 h-full bg-sky-600/10 transform origin-top transition-transform duration-[2000ms] ease-expo-out delay-100"
        :class="mounted ? 'scale-y-100' : 'scale-y-0'"
      />
      <div 
        class="absolute right-[25%] bottom-0 w-4 h-2/3 bg-slate-900 transform origin-bottom transition-transform duration-[2000ms] ease-expo-out delay-300"
        :class="mounted ? 'scale-y-100' : 'scale-y-0'"
      />
      <div 
        class="absolute right-0 top-1/4 w-1/2 h-24 bg-sky-500 transform origin-right transition-all duration-[2500ms] ease-in-out delay-500"
        :class="mounted ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
      />
    </div>

    <div class="relative z-10 flex flex-col justify-between h-full pl-16 pr-12 py-16 w-full">
      
      <div class="flex flex-col items-start space-y-4">
        <div 
          class="w-24 h-2 bg-slate-900 transition-all duration-1000 ease-out"
          :class="mounted ? 'w-24 opacity-100' : 'w-0 opacity-0'"
        />
        
        <div class="space-y-2 ml-4">
            <div class="overflow-hidden">
              <div
                class="text-lg font-bold tracking-widest uppercase text-slate-800 transition-transform duration-1000 ease-out delay-300"
                :class="mounted ? 'translate-y-0' : 'translate-y-full'"
              >
                {{ $slidev.configs.meetingName }}
              </div>
            </div>
            <div class="overflow-hidden">
              <div
                class="text-base font-mono text-sky-800 transition-transform duration-1000 ease-out delay-400"
                :class="mounted ? 'translate-y-0' : 'translate-y-full'"
              >
                {{ $slidev.configs.date }}
              </div>
            </div>
        </div>
      </div>
      
      <div class="space-y-6 py-8 w-full">
        <div 
          :class="[
            'font-bold text-slate-900 leading-[0.9] tracking-tight transition-all duration-1000 ease-out delay-500 w-full !max-w-none break-words space-y-6',
            getTitleSizeClass($slidev.configs.titleSize || 'large'),
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          ]"
        >
          <template v-if="Array.isArray($slidev.configs.coverTitle)">
            <span v-for="(line, index) in $slidev.configs.coverTitle" :key="index" class="block">
              {{ line }}
            </span>
          </template>
          <template v-else>
            <span class="block">{{ $slidev.configs.coverTitle.first }}</span>
            <span class="block text-slate-500">{{ $slidev.configs.coverTitle.second }}</span>
          </template>
        </div>
      </div>
      
      <div class="flex flex-col space-y-6 pt-8 transition-opacity duration-1000 delay-700 w-full"
           :class="mounted ? 'opacity-100' : 'opacity-0'">
        
        <div class="grid grid-cols-2 gap-12">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Presenter</div>
            <div class="text-2xl font-bold text-slate-900 whitespace-nowrap">
              {{ $slidev.configs.author.name }}
            </div>
            <div class="text-sm font-medium text-sky-700 mt-1">
              {{ $slidev.configs.author.affiliation }}
            </div>
          </div>

          <div v-if="coAuthors.length > 0">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Co-Authors</div>
            <div class="space-y-2">
              <div
                v-for="(coAuthor, index) in coAuthors"
                :key="index"
                class="flex flex-col"
              >
                <span class="text-lg font-semibold text-slate-800 whitespace-nowrap">{{ coAuthor.name }}</span>
                <span class="text-xs text-slate-500">{{ coAuthor.affiliation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-4 right-4 text-[10px] font-mono text-slate-800 z-20 writing-vertical-rl">
      © {{ new Date().getFullYear() }} {{ $slidev.configs.author.affiliation }} 
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()
const mounted = ref(false)

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
  }, 100)
})

function getTitleSizeClass(size) {
  const sizeMap = {
    'small': 'text-4xl',
    'medium': 'text-5xl', 
    'large': 'text-8xl', 
    'xlarge': 'text-9xl',
    'xxlarge': 'text-[10rem]'
  }
  return sizeMap[size] || sizeMap['large']
}

const coAuthors = computed(() => {
  const configs = $slidev.configs
  if (!configs || !configs.coAuthors || !Array.isArray(configs.coAuthors)) {
    return []
  }
  return configs.coAuthors.slice(0, 4)
})
</script>

<style scoped>
.slidev-layout {
  padding: 0 !important;
}

.ease-expo-out {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}
.writing-vertical-rl {
  writing-mode: vertical-rl;
}
div {
  font-feature-settings: "palt", "kern";
}

/* === カスタムアニメーション定義 === */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes reverse-spin-slow {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Tailwindのデフォルトspinより遥かに遅く設定し、上品さを出す */
.animate-spin-super-slow {
  animation: spin-slow 80s linear infinite;
}
.animate-reverse-spin-slow {
  animation: reverse-spin-slow 40s linear infinite;
}
.animate-spin-slow {
  animation: spin-slow 30s linear infinite;
}
</style>