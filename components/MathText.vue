<template>
  <component 
    :is="containerTag"
    :class="['math-text-container', containerClass]"
  >
    <!-- スロットが使われている場合 -->
    <template v-if="hasSlotContent">
      <template
        v-for="(segment, index) in processedSlotSegments"
        :key="`slot-${index}`"
      >
        <span 
          v-if="segment.type === 'text'"
          :class="textClass"
          v-html="processTextContent(segment.content)"
        />
        <span 
          v-else-if="segment.type === 'inline-math'"
          :ref="el => setMathElement(`slot-inline-${index}`, el)"
          :class="['inline-math-formula', inlineMathClass]"
          :data-formula="segment.content"
          :data-display-mode="false"
        >
          {{ segment.content }}
        </span>
        <div 
          v-else-if="segment.type === 'block-math'"
          :ref="el => setMathElement(`slot-block-${index}`, el)"
          :class="['block-math-formula', blockMathClass]"
          :data-formula="segment.content"
          :data-display-mode="true"
        >
          {{ segment.content }}
        </div>
        <component
          :is="segment.component"
          v-else-if="segment.type === 'component'"
          v-bind="segment.props"
          v-html="segment.content"
        />
      </template>
    </template>
    
    <!-- textプロパティが使われている場合 -->
    <template v-else-if="text">
      <template
        v-for="(segment, index) in processedTextSegments"
        :key="`text-${index}`"
      >
        <span 
          v-if="segment.type === 'text'"
          :class="textClass"
          v-html="processTextContent(segment.content)"
        />
        <span 
          v-else-if="segment.type === 'inline-math'"
          :ref="el => setMathElement(`text-inline-${index}`, el)"
          :class="['inline-math-formula', inlineMathClass]"
          :data-formula="segment.content"
          :data-display-mode="false"
        >
          {{ segment.content }}
        </span>
        <div 
          v-else-if="segment.type === 'block-math'"
          :ref="el => setMathElement(`text-block-${index}`, el)"
          :class="['block-math-formula', blockMathClass]"
          :data-formula="segment.content"
          :data-display-mode="true"
        >
          {{ segment.content }}
        </div>
      </template>
    </template>
  </component>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch, useSlots } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  containerTag: {
    type: String,
    default: 'span'
  },
  containerClass: {
    type: String,
    default: ''
  },
  inlineMathClass: {
    type: String,
    default: ''
  },
  blockMathClass: {
    type: String,
    default: ''
  },
  textClass: {
    type: String,
    default: ''
  },
  // シンプルモード（SimpleMathText相当）
  simple: {
    type: Boolean,
    default: false
  },
  // Markdownを無効にする
  disableMarkdown: {
    type: Boolean,
    default: false
  },
  // カスタム区切り文字パターン
  customDelimiters: {
    type: Array,
    default: null
  }
})

const slots = useSlots()
const mathElements = ref({})

// スロットにコンテンツがあるかチェック
const hasSlotContent = computed(() => {
  return slots.default && slots.default().length > 0
})

// テキストコンテンツを処理（Markdown + 改行 + HTMLエスケープ）
const processTextContent = (content) => {
  if (!content) return ''
  
  // まずHTMLエスケープ（数式とMarkdownは後で処理）
  let processed = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  // Markdownが有効な場合の処理
  if (!props.disableMarkdown) {
    // リストアイテム（- で始まる行）
    processed = processed.replace(/^- (.+)$/gm, '<li>$1</li>')
    
    // 連続するliタグをulで囲む
    processed = processed.replace(/(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g, '<ul>$1</ul>')
    
    // 番号付きリスト（1. で始まる行）
    processed = processed.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    
    // 連続する番号付きliタグをolで囲む（ulの後に処理）
    processed = processed.replace(/(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g, (match) => {
      // 既にulで囲まれていない場合のみolで囲む
      if (!match.includes('<ul>')) {
        return '<ol>' + match + '</ol>'
      }
      return match
    })
    
    // 太字 **text** または __text__
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>')
    
    // イタリック *text* または _text_（ただし数式の*は除外）
    processed = processed.replace(/(?<!\$[^$]*)\*([^*\n]+?)\*(?![^$]*\$)/g, '<em>$1</em>')
    processed = processed.replace(/(?<!\$[^$]*)_([^_\n]+?)_(?![^$]*\$)/g, '<em>$1</em>')
    
    // コードスパン `code`
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // リンク [text](url)
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // 見出し ### text
    processed = processed.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    processed = processed.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    processed = processed.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    
    // 水平線 ---
    processed = processed.replace(/^---$/gm, '<hr>')
    
    // 引用 > text
    processed = processed.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  }
  
  // 改行を<br>タグに変換（ただし、HTMLタグの直後は除く）
  processed = processed.replace(/\n(?!<)/g, '<br>')
  
  // HTMLタグ間の不要な<br>を除去
  processed = processed.replace(/<\/([^>]+)><br><([^>\/][^>]*)>/g, '</$1><$2>')
  processed = processed.replace(/<\/li><br>/g, '</li>')
  processed = processed.replace(/<br><li>/g, '<li>')
  processed = processed.replace(/<\/ul><br>/g, '</ul>')
  processed = processed.replace(/<\/ol><br>/g, '</ol>')
  processed = processed.replace(/<br><ul>/g, '<ul>')
  processed = processed.replace(/<br><ol>/g, '<ol>')
  
  return processed
}

// スロットの内容をテキストに変換（改良版）
const slotTextContent = computed(() => {
  if (!hasSlotContent.value) return ''
  
  const extractTextFromVNode = (vnode) => {
    if (typeof vnode === 'string') return vnode
    if (typeof vnode === 'number') return String(vnode)
    if (!vnode) return ''
    
    if (Array.isArray(vnode)) {
      return vnode.map(extractTextFromVNode).join('')
    }
    
    // テキストノードの処理
    if (vnode.type === 'text' || vnode.type === Text || typeof vnode.children === 'string') {
      return vnode.children || vnode.text || ''
    }
    
    // 改行要素の処理
    if (vnode.type === 'br') {
      return '\n'
    }
    
    // 子要素がある場合の再帰処理
    if (Array.isArray(vnode.children)) {
      return vnode.children.map(extractTextFromVNode).join('')
    }
    
    // コンポーネントの場合はプレースホルダーを返す
    if (typeof vnode.type === 'object' || typeof vnode.type === 'function') {
      return `<COMPONENT:${vnode.type.name || 'Unknown'}>`
    }
    
    return vnode.children || ''
  }
  
  const result = slots.default().map(extractTextFromVNode).join('')
  return result
})

// デフォルトの区切り文字パターン
const getDelimiters = () => {
  if (props.simple) {
    // シンプルモード：$...$のみ
    return [
      { 
        pattern: /\$([^$\n]+)\$/g, 
        type: 'inline-math',
        process: (match) => match[1].trim()
      }
    ]
  }
  
  return props.customDelimiters || [
    // LaTeX環境（最優先）
    { 
      pattern: /\\begin\{(align\*?|equation\*?|gather\*?|multline\*?|split|eqnarray\*?|alignat\*?|flalign\*?)\}([\s\S]*?)\\end\{\1\}/g, 
      type: 'block-math',
      process: (match) => match[0],
      priority: 0
    },
    // $$...$$（ブロック数式）
    { 
      pattern: /\$\$([^$]*(?:\$(?!\$)[^$]*)*)\$\$/g, 
      type: 'block-math',
      process: (match) => match[1].trim(),
      priority: 1
    },
    // $...$（インライン数式）
    { 
      pattern: /\$([^$\n]+)\$/g, 
      type: 'inline-math',
      process: (match) => match[1].trim(),
      priority: 2
    },
    // \(...\)（インライン数式）
    { 
      pattern: /\\\(([^)]+)\\\)/g, 
      type: 'inline-math',
      process: (match) => match[1].trim(),
      priority: 3
    },
    // \[...\]（ブロック数式）
    { 
      pattern: /\\\[([^\]]+)\\\]/g, 
      type: 'block-math',
      process: (match) => match[1].trim(),
      priority: 4
    }
  ]
}

// テキストを解析してセグメントに分割
const parseTextToSegments = (inputText) => {
  if (!inputText) return []
  
  const delimiters = getDelimiters()
  const segments = []
  let currentText = inputText
  const mathBlocks = []
  
  // 全ての数式パターンを検出
  delimiters.forEach((delimiter, delimiterIndex) => {
    let match
    const regex = new RegExp(delimiter.pattern.source, delimiter.pattern.flags)
    
    while ((match = regex.exec(currentText)) !== null) {
      mathBlocks.push({
        start: match.index,
        end: match.index + match[0].length,
        content: delimiter.process ? delimiter.process(match) : match[1].trim(),
        type: delimiter.type,
        original: match[0],
        priority: delimiter.priority || delimiterIndex
      })
    }
  })
  
  // 開始位置でソート、重複する場合は優先度で決定
  mathBlocks.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    return a.priority - b.priority
  })
  
  // 重複する範囲を除去
  const filteredBlocks = []
  for (let i = 0; i < mathBlocks.length; i++) {
    const current = mathBlocks[i]
    let shouldAdd = true
    
    for (let j = filteredBlocks.length - 1; j >= 0; j--) {
      const existing = filteredBlocks[j]
      
      if (!(current.end <= existing.start || current.start >= existing.end)) {
        if (current.priority < existing.priority || 
           (current.priority === existing.priority && (current.end - current.start) > (existing.end - existing.start))) {
          filteredBlocks.splice(j, 1)
        } else {
          shouldAdd = false
          break
        }
      }
    }
    
    if (shouldAdd) {
      filteredBlocks.push(current)
    }
  }
  
  filteredBlocks.sort((a, b) => a.start - b.start)
  
  // セグメントを構築
  let lastIndex = 0
  
  filteredBlocks.forEach(block => {
    // 数式の前のテキスト部分
    if (block.start > lastIndex) {
      const textContent = currentText.slice(lastIndex, block.start)
      if (textContent) {
        // 改行で分割してセグメントを作成
        const lines = textContent.split('\n')
        lines.forEach((line, lineIndex) => {
          if (line || lineIndex === 0) { // 空行も最初の行なら保持
            segments.push({
              type: 'text',
              content: line
            })
          }
          // 改行を追加（最後の行以外）
          if (lineIndex < lines.length - 1) {
            segments.push({
              type: 'text',
              content: '\n'
            })
          }
        })
      }
    }
    
    // 数式部分
    segments.push({
      type: block.type,
      content: block.content
    })
    
    lastIndex = block.end
  })
  
  // 残りのテキスト
  if (lastIndex < currentText.length) {
    const textContent = currentText.slice(lastIndex)
    if (textContent) {
      const lines = textContent.split('\n')
      lines.forEach((line, lineIndex) => {
        if (line || lineIndex === 0) {
          segments.push({
            type: 'text',
            content: line
          })
        }
        if (lineIndex < lines.length - 1) {
          segments.push({
            type: 'text',
            content: '\n'
          })
        }
      })
    }
  }
  
  return segments
}

// textプロパティから処理されたセグメント
const processedTextSegments = computed(() => {
  if (!props.text) return []
  return parseTextToSegments(props.text)
})

// スロットから処理されたセグメント
const processedSlotSegments = computed(() => {
  if (!hasSlotContent.value) return []
  return parseTextToSegments(slotTextContent.value)
})

// 数式要素の参照を設定
const setMathElement = (key, el) => {
  if (el) {
    mathElements.value[key] = el
  }
}

// 数式レンダリング
const renderMathElements = async () => {
  await nextTick()
  
  for (const [key, element] of Object.entries(mathElements.value)) {
    if (element && element.dataset.formula) {
      const formula = element.dataset.formula
      const displayMode = element.dataset.displayMode === 'true'
      
      try {
        let katex = null
        
        if (typeof window !== 'undefined') {
          katex = window.katex || window.KaTeX
          
          if (!katex) {
            try {
              const katexModule = await import('katex')
              katex = katexModule.default || katexModule
              window.katex = katex
            } catch (e) {
              // KaTeXが利用できない場合のフォールバック
              if (props.simple) {
                element.innerHTML = `<span style="font-style: italic; color: #0066cc; background: #f0f8ff; padding: 1px 3px; border-radius: 3px;">${formula}</span>`
              } else {
                element.textContent = formula
              }
              continue
            }
          }
        }
        
        if (katex && katex.render) {
          katex.render(formula, element, {
            displayMode: displayMode,
            throwOnError: false,
            errorColor: '#cc0000',
            strict: false,
            fleqn: false,
            macros: {
              "\\R": "\\mathbb{R}",
              "\\N": "\\mathbb{N}",
              "\\Z": "\\mathbb{Z}",
              "\\Q": "\\mathbb{Q}",
              "\\C": "\\mathbb{C}",
            }
          })
        }
      } catch (error) {
        console.warn(`Math rendering failed for formula: ${formula}`, error)
        element.textContent = formula
      }
    }
  }
}

onMounted(() => {
  renderMathElements()
})

watch([() => props.text, hasSlotContent], () => {
  mathElements.value = {}
  nextTick(() => {
    renderMathElements()
  })
}, { flush: 'post' })

watch([processedTextSegments, processedSlotSegments], () => {
  nextTick(() => {
    renderMathElements()
  })
}, { flush: 'post' })
</script>

<style scoped>
.math-text-container {
  line-height: 1.6;
}

.math-text-container.inline-container {
  display: inline;
}

.math-text-container.block-container {
  display: block;
}

.inline-math-formula {
  display: inline;
  margin: 0 2px;
}

.block-math-formula {
  display: block;
  margin: 1em 0;
  text-align: center;
}

/* KaTeX用の基本スタイリング */
.inline-math-formula :deep(.katex),
.block-math-formula :deep(.katex) {
  font-size: inherit !important;
}

.inline-math-formula :deep(.katex-html) {
  vertical-align: baseline;
}

.block-math-formula :deep(.katex-display) {
  margin: 0;
  text-align: center;
}

/* シンプルモード用のフォールバックスタイル */
.math-text-container.simple-mode .inline-math-formula {
  font-style: italic;
  color: #0066cc;
  background: #f0f8ff;
  padding: 1px 3px;
  border-radius: 3px;
}
</style>