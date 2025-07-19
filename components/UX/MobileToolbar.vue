<template>
  <div v-if="isMobileDevice" class="mobile-toolbar-wrapper">
    <!-- Mobile Toolbar Toggle Button -->
    <button 
      class="mobile-toolbar-toggle"
      :class="{ 'active': isToolbarVisible }"
      aria-label="Toggle design tools"
      @click="toggleMobileToolbar"
    >
      <span class="material-symbols-sharp">{{ isToolbarVisible ? 'close' : 'build' }}</span>
      <span class="toggle-label">{{ isToolbarVisible ? 'Cerrar' : 'Herramientas' }}</span>
    </button>

    <!-- Mobile Toolbar Panel -->
    <div 
      class="mobile-toolbar-panel"
      :class="{ 'visible': isToolbarVisible }"
    >
      <div class="mobile-toolbar-header">
        <h3>Herramientas de Diseño</h3>
        <button class="close-toolbar" @click="toggleMobileToolbar">
          <span class="material-symbols-sharp">close</span>
        </button>
      </div>

      <div class="mobile-toolbar-content">
        <!-- Quick Actions Section -->
        <div class="mobile-section">
          <h4 class="section-title">🚀 Acciones Rápidas</h4>
          <div class="quick-actions-grid">
            <button 
              class="mobile-tool-btn primary"
              @click="handleAction('add-text')"
            >
              <span class="material-symbols-sharp">text_fields</span>
              <span class="btn-label">Añadir Texto</span>
            </button>
            
            <button 
              class="mobile-tool-btn primary"
              @click="handleAction('deck-color')"
            >
              <span class="material-symbols-sharp">palette</span>
              <span class="btn-label">Color Fondo</span>
            </button>
            
            <button 
              class="mobile-tool-btn"
              @click="handleAction('upload-image')"
            >
              <span class="material-symbols-sharp">add_photo_alternate</span>
              <span class="btn-label">Subir Imagen</span>
            </button>
            
            <button 
              class="mobile-tool-btn"
              @click="handleAction('add-emoji')"
            >
              <span class="material-symbols-sharp">sentiment_satisfied</span>
              <span class="btn-label">Emojis</span>
            </button>
          </div>
        </div>

        <!-- Color Tools Section -->
        <div v-if="expandedSections.includes('colors')" class="mobile-section">
          <div class="section-header" @click="toggleSection('colors')">
            <h4 class="section-title">🎨 Colores</h4>
            <span class="material-symbols-sharp expand-icon">expand_less</span>
          </div>
          <div class="color-tools">
            <div class="color-picker-row">
              <label class="color-label">Fondo de tabla:</label>
              <input 
                type="color" 
                :value="deckColor" 
                class="mobile-color-input"
                @input="$emit('color-change', 'deck', $event.target.value)"
              />
            </div>
            <div v-if="hasSelectedText" class="color-picker-row">
              <label class="color-label">Color de texto:</label>
              <input 
                type="color" 
                :value="textColor" 
                class="mobile-color-input"
                @input="$emit('color-change', 'text', $event.target.value)"
              />
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div v-if="expandedSections.includes('actions')" class="mobile-section">
          <div class="section-header" @click="toggleSection('actions')">
            <h4 class="section-title">⚡ Acciones</h4>
            <span class="material-symbols-sharp expand-icon">expand_less</span>
          </div>
          <div class="action-tools">
            <div class="action-row">
              <button 
                :disabled="!canUndo"
                class="action-btn"
                @click="$emit('tool-action', 'undo')"
              >
                <span class="material-symbols-sharp">undo</span>
                <span>Deshacer</span>
              </button>
              
              <button 
                :disabled="!canRedo"
                class="action-btn"
                @click="$emit('tool-action', 'redo')"
              >
                <span class="material-symbols-sharp">redo</span>
                <span>Rehacer</span>
              </button>
            </div>
            
            <div class="zoom-controls">
              <label class="control-label">Zoom:</label>
              <div class="zoom-buttons">
                <button class="zoom-btn" @click="$emit('tool-action', 'zoom-out')">
                  <span class="material-symbols-sharp">zoom_out</span>
                </button>
                <span class="zoom-level">{{ zoomLevel }}%</span>
                <button class="zoom-btn" @click="$emit('tool-action', 'zoom-in')">
                  <span class="material-symbols-sharp">zoom_in</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Designs & Download Section -->
        <div class="mobile-section">
          <h4 class="section-title">💾 Gestión de Diseños</h4>
          <div class="action-buttons-grid">
            <button 
              class="designs-btn"
              @click="$emit('tool-action', 'my-designs')"
            >
              <span class="material-symbols-sharp">folder</span>
              <span class="btn-text">Mis Diseños</span>
            </button>
            
            <button 
              class="download-btn"
              :disabled="isGeneratingDownload"
              @click="$emit('tool-action', 'download')"
            >
              <span v-if="!isGeneratingDownload" class="material-symbols-sharp">download</span>
              <div v-else class="download-spinner">
                <div class="spinner-dot"></div>
                <div class="spinner-dot"></div>
                <div class="spinner-dot"></div>
              </div>
              <span class="btn-text">
                {{ isGeneratingDownload ? 'Generando...' : 'Descargar' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div 
      v-if="isToolbarVisible" 
      class="mobile-toolbar-overlay"
      @click="toggleMobileToolbar"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  isMobileDevice: {
    type: Boolean,
    default: false
  },
  deckColor: {
    type: String,
    default: '#026ed9'
  },
  textColor: {
    type: String,
    default: '#ff3c22'
  },
  hasSelectedText: {
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
  zoomLevel: {
    type: Number,
    default: 100
  },
  isGeneratingDownload: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tool-action', 'color-change'])

const isToolbarVisible = ref(false)
const expandedSections = ref(['colors', 'actions'])

const toggleMobileToolbar = () => {
  isToolbarVisible.value = !isToolbarVisible.value
}

const toggleSection = (sectionName) => {
  const index = expandedSections.value.indexOf(sectionName)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(sectionName)
  }
}

const handleAction = (action) => {
  emit('tool-action', action)
  // Close toolbar for actions that open other interfaces
  if (['add-text', 'upload-image', 'deck-color', 'add-emoji'].includes(action)) {
    setTimeout(() => {
      isToolbarVisible.value = false
    }, 300)
  }
}

// Close toolbar on swipe down gesture
let startY = 0
let currentY = 0

const handleTouchStart = (e) => {
  startY = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  currentY = e.touches[0].clientY
  const diff = currentY - startY
  
  // If swiping down more than 50px, close toolbar
  if (diff > 50 && isToolbarVisible.value) {
    isToolbarVisible.value = false
  }
}

onMounted(() => {
  if (props.isMobileDevice) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
  }
})

onUnmounted(() => {
  if (props.isMobileDevice) {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
  }
})
</script>

<style scoped>
.mobile-toolbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.mobile-toolbar-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  z-index: 1002;
}

.mobile-toolbar-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.mobile-toolbar-toggle.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
}

.mobile-toolbar-toggle .material-symbols-sharp {
  font-size: 24px;
}

.toggle-label {
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-toolbar-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
  transform: translateY(100%);
  transition: transform 0.3s ease;
  pointer-events: auto;
  z-index: 1001;
  max-height: 70vh;
  overflow-y: auto;
}

.mobile-toolbar-panel.visible {
  transform: translateY(0);
}

.mobile-toolbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  pointer-events: auto;
}

.mobile-toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.mobile-toolbar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-toolbar {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-toolbar:hover {
  background: #f3f4f6;
  color: #374151;
}

.mobile-toolbar-content {
  padding: 0 24px 24px;
}

.mobile-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
}

.expand-icon {
  color: #9ca3af;
  transition: transform 0.2s;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mobile-tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-tool-btn.primary {
  border-color: #3b82f6;
  background: #eff6ff;
}

.mobile-tool-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.mobile-tool-btn .material-symbols-sharp {
  font-size: 24px;
  color: #6b7280;
}

.mobile-tool-btn.primary .material-symbols-sharp {
  color: #3b82f6;
}

.btn-label {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

.mobile-tool-btn.primary .btn-label {
  color: #3b82f6;
}

.color-tools {
  space-y: 12px;
}

.color-picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.color-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.mobile-color-input {
  width: 50px;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
}

.action-tools {
  space-y: 16px;
}

.action-row {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn:not(:disabled):hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.action-btn .material-symbols-sharp {
  font-size: 20px;
  color: #6b7280;
}

.action-btn span:not(.material-symbols-sharp) {
  font-size: 12px;
  color: #374151;
}

.zoom-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.zoom-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.zoom-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.zoom-level {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 50px;
  text-align: center;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.designs-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.designs-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

.download-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.download-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.download-btn:disabled {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
}

.download-spinner {
  display: flex;
  gap: 2px;
  align-items: center;
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

.btn-text {
  font-size: 12px;
  font-weight: 600;
}

.download-text {
  font-size: 14px;
}

/* Animations */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* iOS style improvements */
@supports (-webkit-touch-callout: none) {
  .mobile-toolbar-panel {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .mobile-toolbar-toggle {
    bottom: calc(20px + env(safe-area-inset-bottom));
  }
}
</style>