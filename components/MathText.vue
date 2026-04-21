<template>
  <component 
    :is="containerTag"
    :class="['math-text-container', containerClass]"
    :style="eq ? 'position: relative; display: block;' : ''"
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

    <!-- 数式番号 -->
    <span v-if="eq && eqNumber !== null" class="eq-number">
      ({{ eqNumber }})
    </span>
  </component>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch, useSlots, inject } from 'vue'

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
  simple: {
    type: Boolean,
    default: false
  },
  disableMarkdown: {
    type: Boolean,
    default: false
  },
  customDelimiters: {
    type: Array,
    default: null
  },
  eq: {
    type: String,
    default: null
  }
})

// 数式レジストリ
const equationRegistry = inject('equationRegistry', null)

const eqNumber = computed(() => {
  if (!props.eq || !equationRegistry) return null
  return equationRegistry.getNumber(props.eq)
})

const slots = useSlots()
const mathElements = ref({})

const hasSlotContent = computed(() => {
  return slots.default && slots.default().length > 0
})

const processTextContent = (content) => {
  if (!content) return ''
  
  let processed = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  if (!props.disableMarkdown) {
    processed = processed.replace(/^- (.+)$/gm, '<li>$1</li>')
    processed = processed.replace(/(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g, '<ul>$1</ul>')
    processed = processed.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    processed = processed.replace(/(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g, (match) => {
      if (!match.includes('<ul>')) return '<ol>' + match + '</ol>'
      return match
    })
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>')
    processed = processed.replace(/(?<!\$[^$]*)\*([^*\n]+?)\*(?![^$]*\$)/g, '<em>$1</em>')
    processed = processed.replace(/(?<!\$[^$]*)_([^_\n]+?)_(?![^$]*\$)/g, '<em>$1</em>')
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>')
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    processed = processed.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    processed = processed.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    processed = processed.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    processed = processed.replace(/^---$/gm, '<hr>')
    processed = processed.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  }
  
  processed = processed.replace(/\n(?!<)/g, '<br>')
  processed = processed.replace(/<\/([^>]+)><br><([^>\/][^>]*)>/g, '</$1><$2>')
  processed = processed.replace(/<\/li><br>/g, '</li>')
  processed = processed.replace(/<br><li>/g, '<li>')
  processed = processed.replace(/<\/ul><br>/g, '</ul>')
  processed = processed.replace(/<\/ol><br>/g, '</ol>')
  processed = processed.replace(/<br><ul>/g, '<ul>')
  processed = processed.replace(/<br><ol>/g, '<ol>')
  
  return processed
}

const slotTextContent = computed(() => {
  if (!hasSlotContent.value) return ''
  
  const extractTextFromVNode = (vnode) => {
    if (typeof vnode === 'string') return vnode
    if (typeof vnode === 'number') return String(vnode)
    if (!vnode) return ''
    if (Array.isArray(vnode)) return vnode.map(extractTextFromVNode).join('')
    if (vnode.type === 'text' || vnode.type === Text || typeof vnode.children === 'string') {
      return vnode.children || vnode.text || ''
    }
    if (vnode.type === 'br') return '\n'
    if (Array.isArray(vnode.children)) return vnode.children.map(extractTextFromVNode).join('')
    if (typeof vnode.type === 'object' || typeof vnode.type === 'function') {
      return `<COMPONENT:${vnode.type.name || 'Unknown'}>`
    }
    return vnode.children || ''
  }
  
  return slots.default().map(extractTextFromVNode).join('')
})

const getDelimiters = () => {
  if (props.simple) {
    return [
      { 
        pattern: /\$([^$\n]+)\$/g, 
        type: 'inline-math',
        process: (match) => match[1].trim()
      }
    ]
  }
  
  return props.customDelimiters || [
    { 
      pattern: /\\begin\{(align\*?|equation\*?|gather\*?|multline\*?|split|eqnarray\*?|alignat\*?|flalign\*?)\}([\s\S]*?)\\end\{\1\}/g, 
      type: 'block-math',
      process: (match) => match[0],
      priority: 0
    },
    { 
      pattern: /\$\$([^$]*(?:\$(?!\$)[^$]*)*)\$\$/g, 
      type: 'block-math',
      process: (match) => match[1].trim(),
      priority: 1
    },
    { 
      pattern: /\$([^$\n]+)\$/g, 
      type: 'inline-math',
      process: (match) => match[1].trim(),
      priority: 2
    },
    { 
      pattern: /\\\(([^)]+)\\\)/g, 
      type: 'inline-math',
      process: (match) => match[1].trim(),
      priority: 3
    },
    { 
      pattern: /\\\[([^\]]+)\\\]/g, 
      type: 'block-math',
      process: (match) => match[1].trim(),
      priority: 4
    }
  ]
}

const parseTextToSegments = (inputText) => {
  if (!inputText) return []
  
  const delimiters = getDelimiters()
  const segments = []
  let currentText = inputText
  const mathBlocks = []
  
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
  
  mathBlocks.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    return a.priority - b.priority
  })
  
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
    
    if (shouldAdd) filteredBlocks.push(current)
  }
  
  filteredBlocks.sort((a, b) => a.start - b.start)
  
  let lastIndex = 0
  
  filteredBlocks.forEach(block => {
    if (block.start > lastIndex) {
      const textContent = currentText.slice(lastIndex, block.start)
      if (textContent) {
        const lines = textContent.split('\n')
        lines.forEach((line, lineIndex) => {
          if (line || lineIndex === 0) {
            segments.push({ type: 'text', content: line })
          }
          if (lineIndex < lines.length - 1) {
            segments.push({ type: 'text', content: '\n' })
          }
        })
      }
    }
    
    segments.push({ type: block.type, content: block.content })
    lastIndex = block.end
  })
  
  if (lastIndex < currentText.length) {
    const textContent = currentText.slice(lastIndex)
    if (textContent) {
      const lines = textContent.split('\n')
      lines.forEach((line, lineIndex) => {
        if (line || lineIndex === 0) {
          segments.push({ type: 'text', content: line })
        }
        if (lineIndex < lines.length - 1) {
          segments.push({ type: 'text', content: '\n' })
        }
      })
    }
  }
  
  return segments
}

const processedTextSegments = computed(() => {
  if (!props.text) return []
  return parseTextToSegments(props.text)
})

const processedSlotSegments = computed(() => {
  if (!hasSlotContent.value) return []
  return parseTextToSegments(slotTextContent.value)
})

const setMathElement = (key, el) => {
  if (el) mathElements.value[key] = el
}

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
  if (props.eq && equationRegistry) {
    equationRegistry.register(props.eq)
  }
  renderMathElements()
})

onUnmounted(() => {
  if (props.eq && equationRegistry) {
    equationRegistry.unregister(props.eq)
  }
})

watch([() => props.text, hasSlotContent], () => {
  mathElements.value = {}
  nextTick(() => renderMathElements())
}, { flush: 'post' })

watch([processedTextSegments, processedSlotSegments], () => {
  nextTick(() => renderMathElements())
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

.math-text-container.simple-mode .inline-math-formula {
  font-style: italic;
  color: #0066cc;
  background: #f0f8ff;
  padding: 1px 3px;
  border-radius: 3px;
}

.eq-number {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #374151;
  font-size: 0.9em;
}
</style>