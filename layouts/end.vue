<template>
  <div class="slidev-layout thank-you relative overflow-hidden bg-gradient-to-tr from-sky-100 via-white to-sky-200">
    <!-- 中央の大きな円形要素 -->
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-200/50 rounded-full" />
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-300/60 rounded-full" />
    
    <!-- 左上の波形要素 -->
    <div class="absolute left-0 top-0 w-96 h-96 overflow-hidden">
      <div class="absolute -left-24 -top-24 w-80 h-80 bg-sky-400/40 rounded-full" />
      <div class="absolute left-8 top-8 w-48 h-48 bg-sky-500/30 rounded-full" />
    </div>
    
    <!-- 右下の幾何学的要素 -->
    <div class="absolute right-0 bottom-0 w-80 h-80 overflow-hidden">
      <div class="absolute right-16 bottom-16 w-32 h-32 bg-sky-400/50 transform rotate-45" />
      <div class="absolute right-32 bottom-32 w-24 h-24 bg-sky-500/40 transform rotate-45" />
      <div class="absolute right-8 bottom-8 w-16 h-16 bg-sky-600/50 transform rotate-45" />
    </div>
    
    <!-- 左下のドット要素 -->
    <div class="absolute left-8 bottom-8 grid grid-cols-4 gap-4 opacity-50">
      <div class="w-4 h-4 bg-sky-500 rounded-full" />
      <div class="w-4 h-4 bg-sky-600 rounded-full" />
      <div class="w-4 h-4 bg-sky-500 rounded-full" />
      <div class="w-4 h-4 bg-sky-600 rounded-full" />
      <div class="w-4 h-4 bg-sky-600 rounded-full" />
      <div class="w-4 h-4 bg-sky-500 rounded-full" />
      <div class="w-4 h-4 bg-sky-600 rounded-full" />
      <div class="w-4 h-4 bg-sky-500 rounded-full" />
    </div>
    
    <!-- 右上の線形要素 -->
    <div class="absolute right-8 top-8 transform rotate-12 space-y-3 opacity-60">
      <div class="w-32 h-2 rounded-full bg-sky-500/70" />
      <div class="w-24 h-2 rounded-full bg-sky-600/70" />
      <div class="w-40 h-2 rounded-full bg-sky-500/70" />
      <div class="w-28 h-2 rounded-full bg-sky-600/70" />
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
// 必要に応じてロジックを追加
</script>

<style scoped>
.thank-you {
  font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
}
</style>