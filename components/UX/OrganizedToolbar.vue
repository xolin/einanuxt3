<template>
  <div class="organized-toolbar" :class="{ 'toolbar-mobile': isMobile }">
    <!-- Colors Section -->
    <div class="toolbar-section" id="colors-section">
      <div class="section-header">
        <span class="section-icon">🎨</span>
        <span class="section-title">Colores</span>
        <button 
          v-if="isMobile" 
          @click="toggleSection('colors')"
          class="section-toggle"
          :class="{ 'active': expandedSections.includes('colors') }"
        >
          <span class="material-symbols-sharp">expand_more</span>
        </button>
      </div>
      <div 
        class="section-content" 
        :class="{ 'collapsed': isMobile && !expandedSections.includes('colors') }"
      >
        <div class="tool-group">
          <Tooltip text="Color de fondo de la tabla" shortcut="C" position="bottom">
            <div class="color-picker-container">
              <button 
                class="tool-btn" 
                :class="{ 'active': activeColorPicker === 'deck' }"
                @click="$emit('tool-action', 'deck-color')"
              >
                <span class="material-symbols-sharp">palette</span>
                <span class="tool-label">Fondo</span>
              </button>
              <input 
                v-if="activeColorPicker === 'deck'" 
                type="color" 
                :value="deckColor" 
                @input="$emit('deck-color-change', $event.target.value)"
                class="inline-color-picker" 
              />
            </div>
          </Tooltip>
          
          <Tooltip text="Color del texto seleccionado" shortcut="Shift+C" position="bottom">
            <div class="color-picker-container">
              <button 
                class="tool-btn" 
                :class="{ 'active': activeColorPicker === 'text' }"
                @click="$emit('tool-action', 'text-color')"
              >
                <span class="material-symbols-sharp">format_color_text</span>
                <span class="tool-label">Texto</span>
              </button>
              <input 
                v-if="activeColorPicker === 'text'" 
                type="color" 
                :value="textColor" 
                @input="$emit('text-color-change', $event.target.value)"
                class="inline-color-picker" 
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="toolbar-section" id="content-section">
      <div class="section-header">
        <span class="section-icon">📝</span>
        <span class="section-title">Contenido</span>
        <button 
          v-if="isMobile" 
          @click="toggleSection('content')"
          class="section-toggle"
          :class="{ 'active': expandedSections.includes('content') }"
        >
          <span class="material-symbols-sharp">expand_more</span>
        </button>
      </div>
      <div 
        class="section-content"
        :class="{ 'collapsed': isMobile && !expandedSections.includes('content') }"
      >
        <div class="tool-group">
          <Tooltip text="Añadir texto editable" shortcut="T" position="bottom">
            <button class="tool-btn" @click="$emit('tool-action', 'add-text')">
              <span class="material-symbols-sharp">text_fields</span>
              <span class="tool-label">Texto</span>
            </button>
          </Tooltip>
          
          <Tooltip text="Explorar colección de emojis" shortcut="E" position="bottom">
            <button 
              class="tool-btn" 
              :class="{ 'active': emojiPickerVisible }"
              @click="$emit('tool-action', 'emoji-picker')"
            >
              <span class="material-symbols-sharp">sentiment_satisfied</span>
              <span class="tool-label">Emojis</span>
            </button>
          </Tooltip>
          
          <Tooltip text="Subir imagen personalizada" shortcut="I" position="bottom">
            <button class="tool-btn" @click="$emit('tool-action', 'upload-image')">
              <span class="material-symbols-sharp">add_photo_alternate</span>
              <span class="tool-label">Imagen</span>
            </button>
          </Tooltip>
          
          <Tooltip text="Explorar plantillas pre-diseñadas" shortcut="P" position="bottom">
            <button class="tool-btn template-btn" @click="$emit('tool-action', 'template-gallery')">
              <span class="material-symbols-sharp">dashboard_customize</span>
              <span class="tool-label">Plantillas</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>

    <!-- Typography Section -->
    <div class="toolbar-section" id="typography-section" v-if="hasSelectedText">
      <div class="section-header">
        <span class="section-icon">📝</span>
        <span class="section-title">Tipografía</span>
        <button 
          v-if="isMobile" 
          @click="toggleSection('typography')"
          class="section-toggle"
          :class="{ 'active': expandedSections.includes('typography') }"
        >
          <span class="material-symbols-sharp">expand_more</span>
        </button>
      </div>
      <div 
        class="section-content typography-content"
        :class="{ 'collapsed': isMobile && !expandedSections.includes('typography') }"
      >
        <div class="tool-group typography-group">
          <!-- Font Family Selector -->
          <Tooltip text="Cambiar fuente" position="bottom">
            <div class="typography-control">
              <select 
                :value="selectedFont" 
                @change="$emit('font-change', $event.target.value)"
                class="font-selector"
              >
                <option v-for="font in fontOptions" :key="font.value" :value="font.value">
                  {{ font.name }}
                </option>
              </select>
            </div>
          </Tooltip>
          
          <!-- Font Size Controls -->
          <Tooltip text="Tamaño de fuente" position="bottom">
            <div class="typography-control size-control">
              <button 
                class="size-btn" 
                @click="$emit('font-size-change', 'decrease')"
                :disabled="fontSize <= 8"
              >
                <span class="material-symbols-sharp">remove</span>
              </button>
              <input 
                type="number" 
                :value="fontSize" 
                @change="$emit('font-size-change', parseInt($event.target.value))"
                class="size-input"
                min="8"
                max="200"
              />
              <button 
                class="size-btn" 
                @click="$emit('font-size-change', 'increase')"
                :disabled="fontSize >= 200"
              >
                <span class="material-symbols-sharp">add</span>
              </button>
            </div>
          </Tooltip>
          
          <!-- Font Weight -->
          <Tooltip text="Peso de fuente" position="bottom">
            <div class="typography-control">
              <select 
                :value="fontWeight" 
                @change="$emit('font-weight-change', $event.target.value)"
                class="weight-selector"
              >
                <option value="300">Ligera</option>
                <option value="400">Normal</option>
                <option value="500">Media</option>
                <option value="600">Semi-negrita</option>
                <option value="700">Negrita</option>
                <option value="800">Extra-negrita</option>
              </select>
            </div>
          </Tooltip>
          
          <!-- Text Style Toggles -->
          <div class="style-toggles">
            <Tooltip text="Negrita" position="bottom">
              <button 
                class="style-btn" 
                :class="{ 'active': isBold }"
                @click="$emit('text-style-change', 'bold')"
              >
                <span class="material-symbols-sharp">format_bold</span>
              </button>
            </Tooltip>
            
            <Tooltip text="Cursiva" position="bottom">
              <button 
                class="style-btn" 
                :class="{ 'active': isItalic }"
                @click="$emit('text-style-change', 'italic')"
              >
                <span class="material-symbols-sharp">format_italic</span>
              </button>
            </Tooltip>
            
            <Tooltip text="Subrayado" position="bottom">
              <button 
                class="style-btn" 
                :class="{ 'active': isUnderline }"
                @click="$emit('text-style-change', 'underline')"
              >
                <span class="material-symbols-sharp">format_underlined</span>
              </button>
            </Tooltip>
          </div>
          
          <!-- Text Alignment -->
          <div class="alignment-controls">
            <Tooltip text="Alinear izquierda" position="bottom">
              <button 
                class="align-btn" 
                :class="{ 'active': textAlign === 'left' }"
                @click="$emit('text-align-change', 'left')"
              >
                <span class="material-symbols-sharp">format_align_left</span>
              </button>
            </Tooltip>
            
            <Tooltip text="Centrar" position="bottom">
              <button 
                class="align-btn" 
                :class="{ 'active': textAlign === 'center' }"
                @click="$emit('text-align-change', 'center')"
              >
                <span class="material-symbols-sharp">format_align_center</span>
              </button>
            </Tooltip>
            
            <Tooltip text="Alinear derecha" position="bottom">
              <button 
                class="align-btn" 
                :class="{ 'active': textAlign === 'right' }"
                @click="$emit('text-align-change', 'right')"
              >
                <span class="material-symbols-sharp">format_align_right</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="toolbar-section" id="actions-section">
      <div class="section-header">
        <span class="section-icon">⚡</span>
        <span class="section-title">Acciones</span>
        <button 
          v-if="isMobile" 
          @click="toggleSection('actions')"
          class="section-toggle"
          :class="{ 'active': expandedSections.includes('actions') }"
        >
          <span class="material-symbols-sharp">expand_more</span>
        </button>
      </div>
      <div 
        class="section-content"
        :class="{ 'collapsed': isMobile && !expandedSections.includes('actions') }"
      >
        <div class="tool-group">
          <Tooltip text="Deshacer última acción" shortcut="Ctrl+Z" position="bottom">
            <button 
              class="tool-btn" 
              :disabled="!canUndo"
              @click="$emit('tool-action', 'undo')"
            >
              <span class="material-symbols-sharp">undo</span>
              <span class="tool-label">Deshacer</span>
            </button>
          </Tooltip>
          
          <Tooltip text="Rehacer acción" shortcut="Ctrl+Y" position="bottom">
            <button 
              class="tool-btn" 
              :disabled="!canRedo"
              @click="$emit('tool-action', 'redo')"
            >
              <span class="material-symbols-sharp">redo</span>
              <span class="tool-label">Rehacer</span>
            </button>
          </Tooltip>
          
          <div class="tool-subgroup">
            <Tooltip text="Acercar vista" shortcut="+" position="bottom">
              <button class="tool-btn zoom-btn" @click="$emit('tool-action', 'zoom-in')">
                <span class="material-symbols-sharp">zoom_in</span>
              </button>
            </Tooltip>
            
            <Tooltip text="Alejar vista" shortcut="-" position="bottom">
              <button class="tool-btn zoom-btn" @click="$emit('tool-action', 'zoom-out')">
                <span class="material-symbols-sharp">zoom_out</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Section -->
    <div class="toolbar-section download-section" id="download-section">
      <Tooltip text="Descargar diseño finalizado" shortcut="D" position="bottom">
        <button 
          class="download-btn" 
          :class="{ 'generating': isGeneratingDownload }"
          @click="$emit('tool-action', 'download')"
        >
          <span v-if="!isGeneratingDownload" class="material-symbols-sharp">download</span>
          <div v-else class="download-spinner">
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
          </div>
          <span class="download-label">{{ isGeneratingDownload ? 'Generando...' : 'Descargar' }}</span>
        </button>
      </Tooltip>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeColorPicker: {
    type: String,
    default: null
  },
  emojiPickerVisible: {
    type: Boolean,
    default: false
  },
  canUndo: {
    type: Boolean,
    default: false
  },
  canRedo: {
    type: Boolean,
    default: false
  },
  isGeneratingDownload: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  // Typography props
  hasSelectedText: {
    type: Boolean,
    default: false
  },
  selectedFont: {
    type: String,
    default: 'Arial'
  },
  fontSize: {
    type: Number,
    default: 18
  },
  fontWeight: {
    type: String,
    default: '400'
  },
  isBold: {
    type: Boolean,
    default: false
  },
  isItalic: {
    type: Boolean,
    default: false
  },
  isUnderline: {
    type: Boolean,
    default: false
  },
  textAlign: {
    type: String,
    default: 'left'
  },
  deckColor: {
    type: String,
    default: '#026ed9'
  },
  textColor: {
    type: String,
    default: '#000000'
  }
})

const emit = defineEmits([
  'tool-action',
  'deck-color-change',
  'text-color-change',
  'font-change',
  'font-size-change',
  'font-weight-change',
  'text-style-change',
  'text-align-change'
])

const expandedSections = ref(['colors', 'content', 'typography', 'actions'])

const fontOptions = ref([
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
  { name: 'Caveat', value: 'Caveat, cursive' },
  { name: 'Pacifico', value: 'Pacifico, cursive' }
])

const toggleSection = (sectionName) => {
  const index = expandedSections.value.indexOf(sectionName)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(sectionName)
  }
}

// Auto-detect mobile
onMounted(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth <= 768
    if (mobile && expandedSections.value.length > 2) {
      // Collapse all but colors section on mobile
      expandedSections.value = ['colors']
    }
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})
</script>

<style scoped>
.organized-toolbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toolbar-mobile {
  flex-direction: column;
  gap: 0.5rem;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  min-height: 28px;
}

.section-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex: 1;
}

.section-toggle {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  transform: rotate(0deg);
}

.section-toggle:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.section-toggle.active {
  transform: rotate(180deg);
}

.section-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

.section-content.collapsed {
  max-height: 0;
  opacity: 0;
  padding: 0;
}

.tool-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.toolbar-mobile .tool-group {
  flex-wrap: wrap;
}

.tool-subgroup {
  display: flex;
  gap: 0.25rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.25rem;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 60px;
  position: relative;
}

.tool-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
  transform: translateY(-1px);
}

.tool-btn:active {
  transform: translateY(0);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.tool-btn:disabled:hover {
  border-color: #e5e7eb;
  background: white;
}

.tool-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.tool-btn .material-symbols-sharp {
  font-size: 1.25rem;
  transition: transform 0.2s;
}

.tool-btn:hover .material-symbols-sharp {
  transform: scale(1.1);
}

.tool-label {
  font-size: 0.625rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  line-height: 1;
}

.tool-btn.active .tool-label {
  color: #3b82f6;
}

.template-btn {
  background: linear-gradient(135deg, #f3f4f6, #ffffff);
  border-color: #8b5cf6 !important;
}

.template-btn:hover {
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
  border-color: #7c3aed !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15);
}

.template-btn .material-symbols-sharp {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.template-btn .tool-label {
  color: #7c3aed;
  font-weight: 600;
}

.zoom-btn {
  min-width: 40px;
  padding: 0.5rem;
}

.zoom-btn .tool-label {
  display: none;
}

/* Download Section */
.download-section {
  margin-left: auto;
}

.toolbar-mobile .download-section {
  margin-left: 0;
  margin-top: 0.5rem;
}

.download-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.download-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.download-btn:active {
  transform: translateY(0);
}

.download-btn.generating {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
  transform: none;
}

.download-btn .material-symbols-sharp {
  font-size: 1.5rem;
}

.download-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.download-spinner {
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
}

.spinner-dot {
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.spinner-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-dot:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Mobile specific styles */
@media (max-width: 768px) {
  .organized-toolbar {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .tool-btn {
    min-width: 50px;
    padding: 0.5rem 0.375rem;
  }
  
  .tool-btn .material-symbols-sharp {
    font-size: 1.125rem;
  }
  
  .tool-label {
    font-size: 0.5rem;
  }
  
  .download-btn {
    padding: 0.875rem 1.25rem;
    min-width: 80px;
  }
  
  .download-btn .material-symbols-sharp {
    font-size: 1.25rem;
  }
  
  .download-label {
    font-size: 0.625rem;
  }
}

/* Animation for section expansion */
.section-content:not(.collapsed) {
  max-height: 200px;
  opacity: 1;
}

/* Focus states for accessibility */
.tool-btn:focus,
.download-btn:focus,
.section-toggle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Typography Section Styles */
.typography-content {
  min-width: 400px;
}

.typography-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.typography-control {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.font-selector,
.weight-selector {
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.75rem;
  color: #374151;
  min-width: 80px;
}

.font-selector:focus,
.weight-selector:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.size-control {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f8fafc;
  border-radius: 6px;
  padding: 0.25rem;
}

.size-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #f8fafc;
}

.size-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.size-btn .material-symbols-sharp {
  font-size: 14px;
}

.size-input {
  width: 40px;
  padding: 0.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  text-align: center;
  font-size: 0.75rem;
  background: white;
}

.size-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.style-toggles,
.alignment-controls {
  display: flex;
  gap: 0.25rem;
  background: #f8fafc;
  border-radius: 6px;
  padding: 0.25rem;
}

.style-btn,
.align-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.style-btn:hover,
.align-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.style-btn.active,
.align-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.style-btn .material-symbols-sharp,
.align-btn .material-symbols-sharp {
  font-size: 16px;
}

/* Color Picker Styles */
.color-picker-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inline-color-picker {
  width: 32px;
  height: 32px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  padding: 0;
  transition: all 0.2s;
}

.inline-color-picker:hover {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.inline-color-picker:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Mobile Typography Styles */
@media (max-width: 768px) {
  .typography-content {
    min-width: auto;
  }
  
  .typography-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .typography-control {
    justify-content: space-between;
  }
  
  .font-selector,
  .weight-selector {
    flex: 1;
    min-width: 0;
  }
  
  .style-toggles,
  .alignment-controls {
    justify-content: center;
  }
}
</style>