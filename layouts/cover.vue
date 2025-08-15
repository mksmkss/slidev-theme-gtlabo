<template>
  <div class="slidev-layout cover relative overflow-hidden bg-gradient-to-br from-white via-gray-100 to-sky-200">
    <!-- 大きな円形要素（右上） -->
    <div class="absolute -right-32 -top-32 w-96 h-96 bg-sky-300/70 rounded-full" />
    <div class="absolute right-8 top-24 w-64 h-64 bg-sky-400/60 rounded-full" />
    
    <!-- 左下の三角形要素 -->
    <div class="absolute left-16 bottom-16 w-0 h-0 border-l-48 border-r-48 border-b-80 border-transparent border-b-sky-400/50" />
    <div class="absolute left-32 bottom-32 w-0 h-0 border-l-32 border-r-32 border-b-56 border-transparent border-b-sky-500/55" />
    

    <!-- 右下の斜線要素 -->
    <div class="absolute right-25 bottom-5 transform -translate-y-1/2 rotate-60 space-y-8">
      <div class="w-48 h-3 rounded-md bg-sky-500/70" />
      <div class="w-36 h-3 rounded-md bg-sky-500/70" />
      <div class="w-48 h-3 rounded-md bg-sky-500/70" />
      <div class="w-24 h-3 rounded-md bg-sky-500/70" />
    </div>    
    
    <!-- 左上の円形グリッド（より濃く） -->
    <div class="absolute left-16 top-16 grid grid-cols-3 gap-3 opacity-60">
      <div class="w-8 h-8 bg-sky-600 rounded-full" />
      <div class="w-8 h-8 border-2 border-sky-700 rounded-full" />
      <div class="w-8 h-8 bg-sky-600 rounded-full" />
      <div class="w-8 h-8 bg-sky-600 rounded-full" />
      <div class="w-8 h-8 bg-sky-600 rounded-full" />
      <div class="w-8 h-8 border-2 border-sky-700 rounded-full" />
      <div class="w-8 h-8 border-2 border-sky-700 rounded-full" />
      <div class="w-8 h-8 bg-sky-600 rounded-full" />
      <div class="w-8 h-8 bg-sky-600 rounded-full" />
    </div>
    
    <!-- メインコンテンツ -->
    <div class="relative z-10 flex flex-col justify-center items-start px-8 py-12">
      <div class="max-w-4xl w-full space-y-6">
        <!-- 会議名 -->
        <div class="text-2xl font-semibold text-slate-700">
          {{ $slidev.configs.meetingName }}
        </div>
        
        <!-- メインタイトル（サイズ指定可能） -->
        <div 
          :class="[
            'font-bold text-slate-900 leading-tight',
            getTitleSizeClass($slidev.configs.titleSize || 'large')
          ]"
        >
          {{ $slidev.configs.coverTitle.first }}
          <br>
          {{ $slidev.configs.coverTitle.second }}
        </div>
        
        <!-- 著者情報 -->
        <div class="space-y-2">
          <div class="text-2xl font-semibold text-slate-800">
            {{ $slidev.configs.author.affiliation }}
          </div>
          <div class="text-2xl font-bold text-slate-900">
            {{ $slidev.configs.author.name }}
          </div>
          <!-- 日付 -->
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
</script>