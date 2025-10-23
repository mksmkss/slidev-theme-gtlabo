<template>
  <div class="slidev-layout thank-you relative overflow-hidden animated-gradient">
    <!-- 中央の大きな円形要素 -->
    <div 
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-200/50 rounded-full transition-all duration-[3000ms] ease-in-out"
      :style="centerCircleStyles[0]"
    />
    <div 
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-300/60 rounded-full transition-all duration-[3500ms] ease-in-out"
      :style="centerCircleStyles[1]"
    />
    
    <!-- 左上の波形要素 -->
    <div class="absolute left-0 top-0 w-96 h-96 overflow-hidden">
      <div 
        class="absolute -left-24 -top-24 w-80 h-80 bg-sky-400/40 rounded-full transition-all duration-[4000ms] ease-in-out"
        :style="topLeftCircleStyles[0]"
      />
      <div 
        class="absolute left-8 top-8 w-48 h-48 bg-sky-500/30 rounded-full transition-all duration-[3500ms] ease-in-out"
        :style="topLeftCircleStyles[1]"
      />
    </div>
    
    <!-- 右下の幾何学的要素 -->
    <div class="absolute right-0 bottom-0 w-80 h-80 overflow-hidden">
      <div 
        class="absolute right-16 bottom-16 w-32 h-32 bg-sky-400/50 transform rotate-45 transition-all duration-[3000ms] ease-in-out"
        :style="bottomRightSquareStyles[0]"
      />
      <div 
        class="absolute right-32 bottom-32 w-24 h-24 bg-sky-500/40 transform rotate-45 transition-all duration-[3500ms] ease-in-out"
        :style="bottomRightSquareStyles[1]"
      />
      <div 
        class="absolute right-8 bottom-8 w-16 h-16 bg-sky-600/50 transform rotate-45 transition-all duration-[4000ms] ease-in-out"
        :style="bottomRightSquareStyles[2]"
      />
    </div>
    
    <!-- 左下のドット要素 -->
    <div 
      class="absolute left-8 bottom-8 grid grid-cols-4 gap-4 opacity-50 transition-all duration-[2500ms] ease-in-out"
      :style="dotsGridStyle"
    >
      <div 
        v-for="(dot, index) in dots" 
        :key="index"
        :class="['w-4 h-4 rounded-full transition-all duration-[2500ms] ease-in-out', dot.color]"
        :style="dot.style"
      />
    </div>
    
    <!-- 右上の線形要素 -->
    <div 
      class="absolute right-8 top-8 transform rotate-12 space-y-3 opacity-60 transition-all duration-[4500ms] ease-in-out"
      :style="topRightLinesStyle"
    >
      <div 
        v-for="(width, index) in lineWidths" 
        :key="index"
        :class="['h-2 rounded-full transition-all duration-[2000ms] ease-in-out', index % 2 === 0 ? 'bg-sky-500/70' : 'bg-sky-600/70']"
        :style="{ width: `${width}px` }"
      />
    </div>
    
    <!-- メインコンテンツ -->
    <div class="relative z-10 flex flex-col justify-center items-center h-full px-8">
      <div class="text-center space-y-8">
        <!-- メインメッセージ -->
        <div class="text-5xl font-bold text-slate-800 leading-tight tracking-wide">
          ご清聴ありがとうございました
        </div>
        
        <!-- サブメッセージ（オプション） -->
        <div class="mt-12 text-2xl font-medium text-slate-600">
          {{ $slidev.configs.thankYouMessage || 'Thank you for your attention' }}
        </div>
        
        <!-- 連絡先情報（オプション） -->
        <div class="mt-8 text-lg text-slate-600 space-y-2" v-if="$slidev.configs.contact">
          <div v-if="$slidev.configs.contact.email">
            <lucide-mail class="inline-block w-5 h-5 mr-1" />
            {{ $slidev.configs.contact.email }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右下の著者情報 -->
    <div class="absolute bottom-6 right-8 text-right text-slate-700">
      <div class="text-lg font-semibold">
        {{ $slidev.configs.author.name }}
      </div>
      <div class="text-base font-medium">
        {{ $slidev.configs.author.affiliation }}
      </div>
      <div class="text-sm">
        {{ $slidev.configs.date }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()

// ランダムな値を生成する関数
const randomRange = (min, max) => Math.random() * (max - min) + min

// 中央の円形要素のスタイル
const centerCircleStyles = ref([
  { transform: `translate(${randomRange(-20, 20)}px, ${randomRange(-20, 20)}px) scale(${randomRange(0.95, 1.05)})` },
  { transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) scale(${randomRange(0.95, 1.05)})` }
])

// 左上の円形要素のスタイル
const topLeftCircleStyles = ref([
  { transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) scale(${randomRange(0.9, 1.1)})` },
  { transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) scale(${randomRange(0.9, 1.1)})` }
])

// 右下の正方形要素のスタイル
const bottomRightSquareStyles = ref([
  { transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(40, 50)}deg)` },
  { transform: `translate(${randomRange(-12, 12)}px, ${randomRange(-12, 12)}px) rotate(${randomRange(40, 50)}deg)` },
  { transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px) rotate(${randomRange(40, 50)}deg)` }
])

// 左下のドットグリッドのスタイル
const dotsGridStyle = ref({
  transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px) rotate(${randomRange(-5, 5)}deg)`
})

const dots = ref([
  { color: 'bg-sky-500', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-500', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-500', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-600', style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { color: 'bg-sky-500', style: { transform: `scale(${randomRange(0.85, 1.15)})` } }
])

// 右上の線形要素のスタイル
const topRightLinesStyle = ref({
  transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(7, 17)}deg)`
})

const lineWidths = ref([
  randomRange(120, 144),
  randomRange(90, 110),
  randomRange(150, 170),
  randomRange(105, 125)
])

// アニメーション更新関数
const updateAnimations = () => {
  // 中央の円形要素
  centerCircleStyles.value[0] = {
    transform: `translate(${randomRange(-20, 20)}px, ${randomRange(-20, 20)}px) scale(${randomRange(0.95, 1.05)})`
  }
  centerCircleStyles.value[1] = {
    transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) scale(${randomRange(0.95, 1.05)})`
  }
  
  // 左上の円形要素
  topLeftCircleStyles.value[0] = {
    transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) scale(${randomRange(0.9, 1.1)})`
  }
  topLeftCircleStyles.value[1] = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) scale(${randomRange(0.9, 1.1)})`
  }
  
  // 右下の正方形要素
  bottomRightSquareStyles.value[0] = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(40, 50)}deg)`
  }
  bottomRightSquareStyles.value[1] = {
    transform: `translate(${randomRange(-12, 12)}px, ${randomRange(-12, 12)}px) rotate(${randomRange(40, 50)}deg)`
  }
  bottomRightSquareStyles.value[2] = {
    transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px) rotate(${randomRange(40, 50)}deg)`
  }
  
  // 左下のドットグリッド
  dotsGridStyle.value = {
    transform: `translate(${randomRange(-8, 8)}px, ${randomRange(-8, 8)}px) rotate(${randomRange(-5, 5)}deg)`
  }
  
  dots.value = dots.value.map(dot => ({
    ...dot,
    style: {
      transform: `scale(${randomRange(0.85, 1.15)})`
    }
  }))
  
  // 右上の線形要素
  topRightLinesStyle.value = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(7, 17)}deg)`
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
  // 即座に最初のアニメーションを開始
  setTimeout(() => {
    updateAnimations()
  }, 100)
  
  // 定期的にアニメーションを更新(3秒ごと)
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
/* グラデーション背景のアニメーション */
@keyframes gradient-shift {
  0% {
    background: linear-gradient(to top right, #e0f2fe, white, #f0f9ff);
  }
  33% {
    background: linear-gradient(to top right, #dbeafe, white, #eff6ff);
  }
  66% {
    background: linear-gradient(to top right, #e0f2fe, #f3f4f6, white);
  }
  100% {
    background: linear-gradient(to top right, #e0f2fe, white, #f0f9ff);
  }
}

.animated-gradient {
  animation: gradient-shift 20s ease-in-out infinite;
}

.thank-you {
  font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
}
</style>