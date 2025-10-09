<template>
  <div class="slidev-layout cover relative overflow-hidden animated-gradient">
    <!-- ランダムに動く大きな円形要素(右上) -->
    <div 
      ref="circle1"
      class="absolute -right-32 -top-32 w-96 h-96 bg-sky-300/70 rounded-full transition-all duration-[3000ms] ease-in-out"
      :style="circleStyles[0]"
    />
    <div 
      ref="circle2"
      class="absolute right-8 top-24 w-64 h-64 bg-sky-400/60 rounded-full transition-all duration-[4000ms] ease-in-out"
      :style="circleStyles[1]"
    />
    
    <!-- ランダムに動く左下の三角形要素 -->
    <div 
      class="absolute left-16 bottom-16 w-0 h-0 border-l-48 border-r-48 border-b-80 border-transparent border-b-sky-400/50 transition-all duration-[3500ms] ease-in-out"
      :style="triangleStyles[0]"
    />
    <div 
      class="absolute left-32 bottom-32 w-0 h-0 border-l-32 border-r-32 border-b-56 border-transparent border-b-sky-500/55 transition-all duration-[4500ms] ease-in-out"
      :style="triangleStyles[1]"
    />
    
    <!-- ランダムに動く右下の斜線要素 -->
    <div 
      class="absolute right-25 bottom-5 space-y-8 transition-all duration-[5000ms] ease-in-out"
      :style="linesStyle"
    >
      <div 
        v-for="(width, index) in lineWidths" 
        :key="index"
        class="h-3 rounded-md bg-sky-500/70 transition-all duration-[2000ms] ease-in-out"
        :style="{ width: `${width}px` }"
      />
    </div>    
    
    <!-- ランダムに動く左上の円形グリッド -->
    <div 
      class="absolute left-16 top-16 grid grid-cols-3 gap-3 opacity-60 rotating-grid"
      :style="gridStyle"
    >
      <div 
        v-for="(dot, index) in dots" 
        :key="index"
        :class="[
          'w-8 h-8 rounded-full transition-all duration-[2500ms] ease-in-out',
          dot.filled ? 'bg-sky-600' : 'border-2 border-sky-700'
        ]"
        :style="dot.style"
      />
    </div>
    
    <!-- メインコンテンツ -->
    <div class="relative z-10 flex flex-col justify-center items-start px-8 py-12">
      <div class="max-w-4xl w-full space-y-6">
        <!-- 会議名 -->
        <div class="text-2xl font-semibold text-slate-700">
          {{ $slidev.configs.meetingName }}
        </div>
        
        <!-- メインタイトル -->
        <div 
          :class="[
            'font-bold text-slate-900 leading-tight ',
            getTitleSizeClass($slidev.configs.titleSize || 'large')
          ]"
        >
          <template v-if="Array.isArray($slidev.configs.coverTitle)">
            <span v-for="(line, index) in $slidev.configs.coverTitle" :key="index">
              {{ line }}
              <br v-if="index < $slidev.configs.coverTitle.length - 1">
            </span>
          </template>
          <template v-else>
            {{ $slidev.configs.coverTitle.first }}
            <br>
            {{ $slidev.configs.coverTitle.second }}
          </template>
        </div>
        
        <!-- 著者情報 -->
        <div class="space-y-4">
          <div class="flex flex-col items-end justify-between w-full w-full px-20">
            <div class="text-2xl font-semibold text-slate-800 ">
              {{ $slidev.configs.author.affiliation }}<span class="text-sky-600 ml-2">*</span>{{ $slidev.configs.author.name }}
            </div>
            
            <!-- 共著者 (存在する場合) -->
            <div v-if="coAuthors.length > 0" class="space-y-1 flex flex-col items-end">
              <div
                v-for="(coAuthor, index) in coAuthors"
                :key="index"
                class="text-2xl font-semibold text-slate-800"
              >
                <span class="mr-2"> {{ coAuthor.affiliation }}</span> {{ coAuthor.name }}
              </div>
            </div>
          </div>
          
          <div class="text-xl font-semibold text-slate-700">
            {{ $slidev.configs.date }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 左下のコピーライト風エリア -->
    <div class="absolute bottom-4 left-8 text-slate-700 text-sm font-medium">
      {{ new Date().getFullYear() }} {{ $slidev.configs.author.affiliation }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()

// タイトルサイズのクラスを返す関数
function getTitleSizeClass(size) {
  const sizeMap = {
    'small': 'text-4xl',
    'medium': 'text-5xl', 
    'large': 'text-6xl',
    'xlarge': 'text-7xl',
    'xxlarge': 'text-8xl'
  }
  
  return sizeMap[size] || sizeMap['large']
}

// 共著者リストを取得
const coAuthors = computed(() => {
  const configs = $slidev.configs
  if (!configs || !configs.coAuthors || !Array.isArray(configs.coAuthors)) {
    return []
  }
  console.log(configs.coAuthors)
  // 最大4人まで
  return configs.coAuthors.slice(0, 4)
})

// ランダムな値を生成する関数
const randomRange = (min, max) => Math.random() * (max - min) + min

// 初期状態でランダムな位置を設定
const circleStyles = ref([
  { transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) rotate(${randomRange(-5, 5)}deg)` },
  { transform: `translate(${randomRange(-20, 20)}px, ${randomRange(-20, 20)}px) rotate(${randomRange(-8, 8)}deg)` }
])

const triangleStyles = ref([
  { transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(-3, 3)}deg)` },
  { transform: `translate(${randomRange(-12, 12)}px, ${randomRange(-12, 12)}px) rotate(${randomRange(-4, 4)}deg)` }
])

const linesStyle = ref({ 
  transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) rotate(${randomRange(55, 65)}deg)` 
})

const lineWidths = ref([
  randomRange(180, 204),
  randomRange(130, 158),
  randomRange(180, 204),
  randomRange(85, 107)
])

const gridStyle = ref({})

const dots = ref([
  { filled: true, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: false, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: true, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: true, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: true, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: false, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: false, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: true, style: { transform: `scale(${randomRange(0.85, 1.15)})` } },
  { filled: true, style: { transform: `scale(${randomRange(0.85, 1.15)})` } }
])

// アニメーション更新関数
const updateAnimations = () => {
  // 円形要素をランダムに動かす
  circleStyles.value[0] = {
    transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) rotate(${randomRange(-5, 5)}deg)`
  }
  circleStyles.value[1] = {
    transform: `translate(${randomRange(-20, 20)}px, ${randomRange(-20, 20)}px) rotate(${randomRange(-8, 8)}deg)`
  }
  
  // 三角形要素をランダムに動かす
  triangleStyles.value[0] = {
    transform: `translate(${randomRange(-10, 10)}px, ${randomRange(-10, 10)}px) rotate(${randomRange(-3, 3)}deg)`
  }
  triangleStyles.value[1] = {
    transform: `translate(${randomRange(-12, 12)}px, ${randomRange(-12, 12)}px) rotate(${randomRange(-4, 4)}deg)`
  }
  
  // 斜線要素をランダムに動かす
  linesStyle.value = {
    transform: `translate(${randomRange(-15, 15)}px, ${randomRange(-15, 15)}px) rotate(${randomRange(55, 65)}deg)`
  }
  
  // 斜線の幅をランダムに変更
  lineWidths.value = [
    randomRange(180, 204),
    randomRange(130, 158),
    randomRange(180, 204),
    randomRange(85, 107)
  ]
  
  // ドットをランダムにスケール変更
  dots.value = dots.value.map(dot => ({
    ...dot,
    style: {
      transform: `scale(${randomRange(0.85, 1.15)})`
    }
  }))
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
    background: linear-gradient(to bottom right, white, #f3f4f6, #e0f2fe);
  }
  33% {
    background: linear-gradient(to bottom right, white, #eff6ff, #dbeafe);
  }
  66% {
    background: linear-gradient(to bottom right, white, #f3f4f6, #dbeafe);
  }
  100% {
    background: linear-gradient(to bottom right, white, #f3f4f6, #e0f2fe);
  }
}

.animated-gradient {
  animation: gradient-shift 20s ease-in-out infinite;
}

/* グリッドの常時回転アニメーション */
@keyframes rotate-continuously {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating-grid {
  animation: rotate-continuously 120s linear infinite;
}
</style>