<template>
  <div class="slidev-layout end relative w-full h-full !p-0 bg-white overflow-hidden font-sans text-slate-900 selection:bg-sky-200 selection:text-sky-900">
    
    <div class="absolute inset-0 z-0 pointer-events-none opacity-10" 
         style="background-image: linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px); background-size: 50px 50px;">
    </div>

    <div 
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] z-0 pointer-events-none transition-all duration-[3000ms] ease-in-out"
      :style="centerCircleStyles[0]"
    >
      <div class="w-full h-full border-2 border-dashed border-slate-300 rounded-full opacity-50"></div>
    </div>
    <div 
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[45vh] h-[45vh] z-0 pointer-events-none transition-all duration-[3500ms] ease-in-out"
      :style="centerCircleStyles[1]"
    >
      <div class="w-full h-full border-2 border-dotted border-sky-700 rounded-full opacity-30"></div>
    </div>
    
    <div class="absolute left-0 top-0 w-96 h-96 overflow-hidden pointer-events-none z-0">
      <div 
        class="absolute -left-12 -top-12 w-64 h-64 border border-slate-200 transition-all duration-[4000ms] ease-in-out"
        :style="topLeftCircleStyles[0]"
      />
      <div 
        class="absolute left-12 top-12 w-32 h-32 bg-sky-200/80 transition-all duration-[3500ms] ease-in-out"
        :style="topLeftCircleStyles[1]"
      />
    </div>
    
    <div class="absolute right-0 bottom-0 w-80 h-80 overflow-hidden pointer-events-none z-0">
      <div 
        class="absolute right-16 bottom-16 w-32 h-32 bg-slate-900/5 transform rotate-45 transition-all duration-[3000ms] ease-in-out"
        :style="bottomRightSquareStyles[0]"
      />
      <div 
        class="absolute right-32 bottom-32 w-24 h-24 border border-sky-500/30 transform rotate-45 transition-all duration-[3500ms] ease-in-out"
        :style="bottomRightSquareStyles[1]"
      />
      <div 
        class="absolute right-8 bottom-8 w-16 h-16 bg-sky-800/10 transform rotate-45 transition-all duration-[4000ms] ease-in-out"
        :style="bottomRightSquareStyles[2]"
      />
    </div>
    
    <div 
      class="absolute left-12 bottom-12 grid grid-cols-4 gap-3 opacity-60 transition-all duration-[2500ms] ease-in-out z-0"
      :style="dotsGridStyle"
    >
      <div 
        v-for="(dot, index) in dots" 
        :key="index"
        :class="['w-1.5 h-1.5 transition-all duration-[2500ms] ease-in-out', dot.colorClass]"
        :style="dot.style"
      />
    </div>
    
    <div 
      class="absolute right-12 top-12 transform rotate-0 space-y-2 opacity-60 transition-all duration-[4500ms] ease-in-out z-0"
      :style="topRightLinesStyle"
    >
      <div 
        v-for="(width, index) in lineWidths" 
        :key="index"
        :class="['h-1 transition-all duration-[2000ms] ease-in-out', index % 2 === 0 ? 'bg-slate-900' : 'bg-sky-600']"
        :style="{ width: `${width}px` }"
      />
    </div>
    
    <div class="relative z-10 flex flex-col justify-center items-center h-full px-16 w-full">
      <div class="flex flex-col items-start space-y-8 max-w-4xl">
        
        <div class="w-24 h-2 bg-slate-900"></div>

        <div class="text-7xl font-bold text-slate-900 leading-[0.9] tracking-tight">
          <span class="block">THANK YOU</span>
          <span class="block text-slate-400">FOR LISTENING</span>
        </div>
        
        <p class="pt-4 text-xl font-mono text-sky-800 tracking-wide leading-normal">
          {{ $slidev.configs.thankYouMessage || 'ご清聴ありがとうございました' }}
        </p>
        
        <div class="pt-8 grid grid-cols-1 gap-4 text-base text-slate-600" v-if="$slidev.configs.contact">
          <div v-if="$slidev.configs.contact.email" class="flex items-center space-x-3">
            <span class="w-8 h-[1px] bg-slate-400"></span>
            <span class="font-semibold text-slate-900">EMAIL</span>
            <span>{{ $slidev.configs.contact.email }}</span>
          </div>
          <div v-if="$slidev.configs.contact.twitter" class="flex items-center space-x-3">
             <span class="w-8 h-[1px] bg-slate-400"></span>
             <span class="font-semibold text-slate-900">X / TWITTER</span>
             <span>{{ $slidev.configs.contact.twitter }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="absolute bottom-4 right-4 text-[10px] font-mono text-slate-800 z-20 writing-vertical-rl">
      {{ $slidev.configs.author.name }} / {{ $slidev.configs.author.affiliation }}
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()

const randomRange = (min, max) => Math.random() * (max - min) + min

const centerCircleStyles = ref([
  { transform: `translate(${randomRange(-20, 20)}px, ${randomRange(-20, 20)}px) scale(${randomRange(0.98, 1.02)})` },
  { transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) scale(${randomRange(0.98, 1.02)})` }
])

const topLeftCircleStyles = ref([
  { transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px)` },
  { transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px)` }
])

const bottomRightSquareStyles = ref([
  { transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(40, 50)}deg)` },
  { transform: `translate(${randomRange(-12, 12)}px, ${randomRange(-12, 12)}px) rotate(${randomRange(40, 50)}deg)` },
  { transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px) rotate(${randomRange(40, 50)}deg)` }
])

const dotsGridStyle = ref({
  transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px)`
})

const dots = ref([
  { colorClass: 'bg-slate-900', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-slate-900', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-slate-900', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { colorClass: 'bg-slate-900', style: { transform: `scale(${randomRange(0.85, 1.15)})` } }
])

const topRightLinesStyle = ref({
  transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px)`
})

const lineWidths = ref([
  randomRange(120, 144),
  randomRange(90, 110),
  randomRange(150, 170),
  randomRange(105, 125)
])

const updateAnimations = () => {
  centerCircleStyles.value[0] = {
    transform: `translate(${randomRange(-20, 20)}px, ${randomRange(-20, 20)}px) scale(${randomRange(0.98, 1.02)})`
  }
  centerCircleStyles.value[1] = {
    transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) scale(${randomRange(0.98, 1.02)})`
  }
  
  topLeftCircleStyles.value[0] = {
    transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px)`
  }
  topLeftCircleStyles.value[1] = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px)`
  }
  
  bottomRightSquareStyles.value[0] = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(40, 50)}deg)`
  }
  bottomRightSquareStyles.value[1] = {
    transform: `translate(${randomRange(-12, 12)}px, ${randomRange(-12, 12)}px) rotate(${randomRange(40, 50)}deg)`
  }
  bottomRightSquareStyles.value[2] = {
    transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px) rotate(${randomRange(40, 50)}deg)`
  }
  
  dotsGridStyle.value = {
    transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px)`
  }
  
  dots.value = dots.value.map(dot => ({
    ...dot,
    style: {
      transform: `scale(${randomRange(0.85, 1.15)})`
    }
  }))
  
  topRightLinesStyle.value = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px)`
  }
  
  lineWidths.value = [
    randomRange(120, 144),
    randomRange(90, 110),
    randomRange(150, 170),
    randomRange(105, 125)
  ]
}

let intervalId = null

onMounted(() => {
  setTimeout(() => {
    updateAnimations()
  }, 100)
  
  intervalId = setInterval(() => {
    updateAnimations()
  }, 3000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.slidev-layout {
  padding: 0 !important;
}

.writing-vertical-rl {
  writing-mode: vertical-rl;
}

div, p {
  font-feature-settings: "palt", "kern";
}
</style>
