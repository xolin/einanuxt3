<template>
  <div class="text-formatting">
    <!-- Toggle Button -->
    <Tooltip text="Formato de texto avanzado" shortcut="F" position="left">
      <button
        class="fixed top-20 left-0 transform bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg shadow-lg z-40 transition-colors duration-200"
        :class="{ 'left-80': isOpen }"
        :disabled="!hasSelectedText"
        @click="togglePanel"
      >
        <span class="material-symbols-sharp text-xl">
          {{ isOpen ? 'close' : 'format_text_wrap' }}
        </span>
      </button>
    </Tooltip>

    <!-- Panel -->
    <div
      :class="{ 'translate-x-0': isOpen, '-translate-x-full': !isOpen }"
      class="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-30 transform transition-transform duration-300 overflow-y-auto border-r border-gray-200"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Formato de Texto</h2>
          <button 
            class="text-gray-500 hover:text-gray-700 p-1"
            @click="closePanel"
          >
            <span class="material-symbols-sharp">close</span>
          </button>
        </div>

        <!-- No Text Selected State -->
        <div v-if="!hasSelectedText" class="text-center py-8 text-gray-500">
          <span class="material-symbols-sharp text-4xl mb-2 block">text_fields</span>
          <p class="text-sm">Selecciona un texto</p>
          <p class="text-xs text-gray-400 mt-1">Haz clic en un texto del canvas para editarlo</p>
        </div>

        <!-- Text Formatting Controls -->
        <div v-else class="space-y-6">
          <!-- Font Family -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Fuente
            </label>
            <select
              v-model="selectedFont"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="updateFont"
            >
              <option v-for="font in fontFamilies" :key="font.value" :value="font.value">
                {{ font.name }}
              </option>
            </select>
            <div class="mt-2 text-xs text-gray-500">
              Vista previa: <span :style="{ fontFamily: selectedFont }" class="text-base">Texto de ejemplo</span>
            </div>
          </div>

          <!-- Font Size -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Tamaño: {{ fontSize }}px
            </label>
            <div class="flex items-center space-x-3">
              <button
                class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                @click="decreaseFontSize"
              >
                <span class="material-symbols-sharp text-sm">remove</span>
              </button>
              <input
                v-model="fontSize"
                type="range"
                min="8"
                max="200"
                step="1"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                @input="updateFontSize"
              />
              <button
                class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                @click="increaseFontSize"
              >
                <span class="material-symbols-sharp text-sm">add</span>
              </button>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>8px</span>
              <span>200px</span>
            </div>
          </div>

          <!-- Font Weight -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Peso de la fuente
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="weight in fontWeights"
                :key="weight.value"
                :class="[
                  'px-3 py-2 text-sm rounded-lg border transition-colors',
                  fontWeight === weight.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                :style="{ fontWeight: weight.value }"
                @click="updateFontWeight(weight.value)"
              >
                {{ weight.name }}
              </button>
            </div>
          </div>

          <!-- Text Style -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Estilo
            </label>
            <div class="flex space-x-2">
              <button
                :class="[
                  'p-2 rounded-lg border transition-colors flex-1',
                  isBold
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                @click="toggleBold"
              >
                <span class="material-symbols-sharp font-bold">format_bold</span>
              </button>
              <button
                :class="[
                  'p-2 rounded-lg border transition-colors flex-1',
                  isItalic
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                @click="toggleItalic"
              >
                <span class="material-symbols-sharp italic">format_italic</span>
              </button>
              <button
                :class="[
                  'p-2 rounded-lg border transition-colors flex-1',
                  isUnderline
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                @click="toggleUnderline"
              >
                <span class="material-symbols-sharp underline">format_underlined</span>
              </button>
            </div>
          </div>

          <!-- Text Alignment -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Alineación
            </label>
            <div class="flex space-x-2">
              <button
                v-for="align in textAlignments"
                :key="align.value"
                :class="[
                  'p-2 rounded-lg border transition-colors flex-1',
                  textAlign === align.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                @click="updateTextAlign(align.value)"
              >
                <span class="material-symbols-sharp">{{ align.icon }}</span>
              </button>
            </div>
          </div>

          <!-- Line Height -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Altura de línea: {{ lineHeight }}
            </label>
            <input
              v-model="lineHeight"
              type="range"
              min="0.8"
              max="3"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              @input="updateLineHeight"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.8</span>
              <span>Normal (1.2)</span>
              <span>3.0</span>
            </div>
          </div>

          <!-- Letter Spacing -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Espaciado: {{ letterSpacing }}px
            </label>
            <input
              v-model="letterSpacing"
              type="range"
              min="-5"
              max="20"
              step="0.5"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              @input="updateLetterSpacing"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>-5px</span>
              <span>Normal (0)</span>
              <span>20px</span>
            </div>
          </div>

          <!-- Text Color -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Color del texto
            </label>
            <div class="flex items-center space-x-3">
              <input
                v-model="textColor"
                type="color"
                class="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                @input="updateTextColor"
              />
              <input
                v-model="textColor"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="#000000"
                @change="updateTextColor"
              />
            </div>
            
            <!-- Color Presets -->
            <div class="mt-3">
              <p class="text-xs text-gray-600 mb-2">Colores rápidos:</p>
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="color in colorPresets"
                  :key="color"
                  :style="{ backgroundColor: color }"
                  class="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  :title="color"
                  @click="setTextColor(color)"
                ></button>
              </div>
            </div>
          </div>

          <!-- Text Effects -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Efectos
            </label>
            
            <!-- Text Shadow -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Sombra de texto</span>
                <button
                  :class="[
                    'px-3 py-1 text-xs rounded-lg transition-colors',
                    hasTextShadow
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                  @click="toggleTextShadow"
                >
                  {{ hasTextShadow ? 'ON' : 'OFF' }}
                </button>
              </div>
              
              <div v-if="hasTextShadow" class="pl-4 space-y-2">
                <div>
                  <label class="text-xs text-gray-600">Offset X: {{ shadowOffsetX }}px</label>
                  <input
                    v-model="shadowOffsetX"
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    @input="updateTextShadow"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600">Offset Y: {{ shadowOffsetY }}px</label>
                  <input
                    v-model="shadowOffsetY"
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    @input="updateTextShadow"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600">Blur: {{ shadowBlur }}px</label>
                  <input
                    v-model="shadowBlur"
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    @input="updateTextShadow"
                  />
                </div>
                <div class="flex items-center space-x-2">
                  <label class="text-xs text-gray-600">Color:</label>
                  <input
                    v-model="shadowColor"
                    type="color"
                    class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    @input="updateTextShadow"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Text Transform -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Transformación
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="transform in textTransforms"
                :key="transform.value"
                :class="[
                  'px-3 py-2 text-sm rounded-lg border transition-colors',
                  textTransform === transform.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                @click="updateTextTransform(transform.value)"
              >
                {{ transform.name }}
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Acciones rápidas</h3>
            <div class="space-y-2">
              <button
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                @click="resetFormatting"
              >
                🔄 Restablecer formato
              </button>
              <button
                class="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                @click="copyFormatting"
              >
                📋 Copiar formato
              </button>
              <button
                v-if="hasStoredFormat"
                class="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition duration-200"
                @click="pasteFormatting"
              >
                📄 Pegar formato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  selectedText: Object,
  hasSelectedText: Boolean
})

const emit = defineEmits([
  'update-font-family',
  'update-font-size',
  'update-font-weight',
  'update-text-style',
  'update-text-align',
  'update-line-height',
  'update-letter-spacing',
  'update-text-color',
  'update-text-shadow',
  'update-text-transform',
  'reset-formatting',
  'copy-formatting',
  'paste-formatting'
])

// Component state
const isOpen = ref(false)
const storedFormat = ref(null)

// Text properties
const selectedFont = ref('Arial')
const fontSize = ref(18)
const fontWeight = ref('400')
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const textAlign = ref('left')
const lineHeight = ref(1.2)
const letterSpacing = ref(0)
const textColor = ref('#000000')
const textTransform = ref('none')

// Shadow properties
const hasTextShadow = ref(false)
const shadowOffsetX = ref(2)
const shadowOffsetY = ref(2)
const shadowBlur = ref(4)
const shadowColor = ref('#000000')

// Font options
const fontFamilies = ref([
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Palatino', value: 'Palatino, serif' },
  { name: 'Lucida Console', value: 'Lucida Console, monospace' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' }
])

const fontWeights = ref([
  { name: 'Ligera', value: '300' },
  { name: 'Normal', value: '400' },
  { name: 'Media', value: '500' },
  { name: 'Semi-negrita', value: '600' },
  { name: 'Negrita', value: '700' },
  { name: 'Extra-negrita', value: '800' }
])

const textAlignments = ref([
  { name: 'Izquierda', value: 'left', icon: 'format_align_left' },
  { name: 'Centro', value: 'center', icon: 'format_align_center' },
  { name: 'Derecha', value: 'right', icon: 'format_align_right' },
  { name: 'Justificado', value: 'justify', icon: 'format_align_justify' }
])

const textTransforms = ref([
  { name: 'Normal', value: 'none' },
  { name: 'MAYÚSCULAS', value: 'uppercase' },
  { name: 'minúsculas', value: 'lowercase' },
  { name: 'Primera Letra', value: 'capitalize' }
])

const colorPresets = ref([
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', 
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000',
  '#800080', '#008080', '#C0C0C0', '#808080'
])

// Computed properties
const hasStoredFormat = computed(() => storedFormat.value !== null)

// Methods
const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}

const updateFont = () => {
  emit('update-font-family', selectedFont.value)
}

const updateFontSize = () => {
  emit('update-font-size', parseInt(fontSize.value))
}

const increaseFontSize = () => {
  fontSize.value = Math.min(parseInt(fontSize.value) + 2, 200)
  updateFontSize()
}

const decreaseFontSize = () => {
  fontSize.value = Math.max(parseInt(fontSize.value) - 2, 8)
  updateFontSize()
}

const updateFontWeight = (weight) => {
  fontWeight.value = weight
  emit('update-font-weight', weight)
}

const toggleBold = () => {
  isBold.value = !isBold.value
  emit('update-text-style', { bold: isBold.value })
}

const toggleItalic = () => {
  isItalic.value = !isItalic.value
  emit('update-text-style', { italic: isItalic.value })
}

const toggleUnderline = () => {
  isUnderline.value = !isUnderline.value
  emit('update-text-style', { underline: isUnderline.value })
}

const updateTextAlign = (align) => {
  textAlign.value = align
  emit('update-text-align', align)
}

const updateLineHeight = () => {
  emit('update-line-height', parseFloat(lineHeight.value))
}

const updateLetterSpacing = () => {
  emit('update-letter-spacing', parseFloat(letterSpacing.value))
}

const updateTextColor = () => {
  emit('update-text-color', textColor.value)
}

const setTextColor = (color) => {
  textColor.value = color
  updateTextColor()
}

const updateTextTransform = (transform) => {
  textTransform.value = transform
  emit('update-text-transform', transform)
}

const toggleTextShadow = () => {
  hasTextShadow.value = !hasTextShadow.value
  updateTextShadow()
}

const updateTextShadow = () => {
  const shadow = hasTextShadow.value ? {
    offsetX: parseInt(shadowOffsetX.value),
    offsetY: parseInt(shadowOffsetY.value),
    blur: parseInt(shadowBlur.value),
    color: shadowColor.value
  } : null
  
  emit('update-text-shadow', shadow)
}

const resetFormatting = () => {
  selectedFont.value = 'Arial, sans-serif'
  fontSize.value = 18
  fontWeight.value = '400'
  isBold.value = false
  isItalic.value = false
  isUnderline.value = false
  textAlign.value = 'left'
  lineHeight.value = 1.2
  letterSpacing.value = 0
  textColor.value = '#000000'
  textTransform.value = 'none'
  hasTextShadow.value = false
  
  emit('reset-formatting')
}

const copyFormatting = () => {
  storedFormat.value = {
    fontFamily: selectedFont.value,
    fontSize: fontSize.value,
    fontWeight: fontWeight.value,
    bold: isBold.value,
    italic: isItalic.value,
    underline: isUnderline.value,
    textAlign: textAlign.value,
    lineHeight: lineHeight.value,
    letterSpacing: letterSpacing.value,
    color: textColor.value,
    textTransform: textTransform.value,
    shadow: hasTextShadow.value ? {
      offsetX: shadowOffsetX.value,
      offsetY: shadowOffsetY.value,
      blur: shadowBlur.value,
      color: shadowColor.value
    } : null
  }
  
  emit('copy-formatting', storedFormat.value)
}

const pasteFormatting = () => {
  if (!storedFormat.value) return
  
  const format = storedFormat.value
  selectedFont.value = format.fontFamily
  fontSize.value = format.fontSize
  fontWeight.value = format.fontWeight
  isBold.value = format.bold
  isItalic.value = format.italic
  isUnderline.value = format.underline
  textAlign.value = format.textAlign
  lineHeight.value = format.lineHeight
  letterSpacing.value = format.letterSpacing
  textColor.value = format.color
  textTransform.value = format.textTransform
  
  if (format.shadow) {
    hasTextShadow.value = true
    shadowOffsetX.value = format.shadow.offsetX
    shadowOffsetY.value = format.shadow.offsetY
    shadowBlur.value = format.shadow.blur
    shadowColor.value = format.shadow.color
  } else {
    hasTextShadow.value = false
  }
  
  emit('paste-formatting', format)
}

// Watch for selected text changes
watch(() => props.selectedText, (newText) => {
  if (newText) {
    // Update UI with current text properties
    selectedFont.value = newText.fontFamily || 'Arial, sans-serif'
    fontSize.value = newText.fontSize || 18
    fontWeight.value = newText.fontWeight || '400'
    isBold.value = newText.fontWeight === 'bold' || parseInt(newText.fontWeight) >= 600
    isItalic.value = newText.fontStyle === 'italic'
    isUnderline.value = newText.underline || false
    textAlign.value = newText.textAlign || 'left'
    lineHeight.value = newText.lineHeight || 1.2
    letterSpacing.value = newText.charSpacing || 0
    textColor.value = newText.fill || '#000000'
    textTransform.value = newText.textTransform || 'none'
    
    if (newText.shadow) {
      hasTextShadow.value = true
      shadowOffsetX.value = newText.shadow.offsetX || 2
      shadowOffsetY.value = newText.shadow.offsetY || 2
      shadowBlur.value = newText.shadow.blur || 4
      shadowColor.value = newText.shadow.color || '#000000'
    } else {
      hasTextShadow.value = false
    }
  }
}, { immediate: true })

// Expose methods for parent component
defineExpose({
  togglePanel,
  isOpen
})
</script>

<style scoped>
/* Custom scrollbar */
.text-formatting ::-webkit-scrollbar {
  width: 6px;
}

.text-formatting ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.text-formatting ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.text-formatting ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Range slider styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>