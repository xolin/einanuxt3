<template>
  <div class="mobile-toolbar" :class="{ 'visible': isVisible }">
    <!-- Main toolbar -->
    <div class="toolbar-container">
      <!-- Swipe indicator -->
      <div class="swipe-indicator" v-if="showSwipeIndicator">
        <div class="swipe-line"></div>
        <span class="swipe-text">Desliza para más herramientas</span>
      </div>
      
      <!-- Tool sections -->
      <div class="tool-sections" ref="toolSections">
        <!-- Essential tools -->
        <div class="tool-section" :class="{ 'active': currentSection === 'essential' }">
          <button 
            class="tool-button primary"
            @click="$emit('tool-select', 'text')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">📝</span>
            <span class="tool-label">Texto</span>
          </button>
          
          <button 
            class="tool-button primary"
            @click="$emit('tool-select', 'color')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">🎨</span>
            <span class="tool-label">Color</span>
          </button>
          
          <button 
            class="tool-button primary"
            @click="$emit('tool-select', 'image')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">📷</span>
            <span class="tool-label">Imagen</span>
          </button>
          
          <button 
            class="tool-button primary"
            @click="$emit('tool-select', 'emoji')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">😊</span>
            <span class="tool-label">Emoji</span>
          </button>
        </div>
        
        <!-- Advanced tools -->
        <div class="tool-section" :class="{ 'active': currentSection === 'advanced' }">
          <button 
            class="tool-button"
            @click="$emit('tool-select', 'shapes')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">⭕</span>
            <span class="tool-label">Formas</span>
          </button>
          
          <button 
            class="tool-button"
            @click="$emit('tool-select', 'filters')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">✨</span>
            <span class="tool-label">Filtros</span>
          </button>
          
          <button 
            class="tool-button"
            @click="$emit('tool-select', 'layers')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">📚</span>
            <span class="tool-label">Capas</span>
          </button>
          
          <button 
            class="tool-button"
            @click="$emit('tool-select', 'templates')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">🎨</span>
            <span class="tool-label">Plantillas</span>
          </button>
        </div>
        
        <!-- Actions -->
        <div class="tool-section" :class="{ 'active': currentSection === 'actions' }">
          <button 
            class="tool-button action"
            @click="$emit('action', 'undo')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">↶</span>
            <span class="tool-label">Deshacer</span>
          </button>
          
          <button 
            class="tool-button action"
            @click="$emit('action', 'redo')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">↷</span>
            <span class="tool-label">Rehacer</span>
          </button>
          
          <button 
            class="tool-button action"
            @click="$emit('action', 'save')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">💾</span>
            <span class="tool-label">Guardar</span>
          </button>
          
          <button 
            class="tool-button action"
            @click="$emit('action', 'download')"
            @touchstart="hapticFeedback"
          >
            <span class="tool-icon">⬇️</span>
            <span class="tool-label">Descargar</span>
          </button>
        </div>
      </div>
      
      <!-- Section indicators -->
      <div class="section-indicators">
        <div 
          class="indicator"
          :class="{ 'active': currentSection === 'essential' }"
          @click="switchSection('essential')"
        ></div>
        <div 
          class="indicator"
          :class="{ 'active': currentSection === 'advanced' }"
          @click="switchSection('advanced')"
        ></div>
        <div 
          class="indicator"
          :class="{ 'active': currentSection === 'actions' }"
          @click="switchSection('actions')"
        ></div>
      </div>
    </div>
    
    <!-- Quick actions fab -->
    <div class="quick-actions-fab" v-if="!isToolbarExpanded">
      <button 
        class="fab-button"
        @click="toggleToolbar"
        @touchstart="hapticFeedback"
      >
        <span class="fab-icon">🛠️</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTouchGestures } from '~/composables/useTouchGestures'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: true
  },
  selectedTool: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['tool-select', 'action', 'toggle-toolbar'])

const { lightHaptic, mediumHaptic, setupGestureDetection, onGesture } = useTouchGestures()

const currentSection = ref('essential')
const isToolbarExpanded = ref(true)
const showSwipeIndicator = ref(true)
const toolSections = ref(null)

let gestureCleanup = null

const hapticFeedback = () => {
  lightHaptic()
}

const switchSection = (section) => {
  currentSection.value = section
  mediumHaptic()
}

const toggleToolbar = () => {
  isToolbarExpanded.value = !isToolbarExpanded.value
  emit('toggle-toolbar', isToolbarExpanded.value)
  mediumHaptic()
}

// Handle swipe gestures
const handleSwipe = (data) => {
  if (data.direction === 'left') {
    // Swipe left - next section
    const sections = ['essential', 'advanced', 'actions']
    const currentIndex = sections.indexOf(currentSection.value)
    const nextIndex = (currentIndex + 1) % sections.length
    switchSection(sections[nextIndex])
  } else if (data.direction === 'right') {
    // Swipe right - previous section
    const sections = ['essential', 'advanced', 'actions']
    const currentIndex = sections.indexOf(currentSection.value)
    const prevIndex = (currentIndex - 1 + sections.length) % sections.length
    switchSection(sections[prevIndex])
  }
}

onMounted(() => {
  if (toolSections.value) {
    gestureCleanup = setupGestureDetection(toolSections.value)
    onGesture('swipe', handleSwipe)
  }
  
  // Hide swipe indicator after 3 seconds
  setTimeout(() => {
    showSwipeIndicator.value = false
  }, 3000)
})

onUnmounted(() => {
  if (gestureCleanup) {
    gestureCleanup()
  }
})
</script>

<style scoped>
.mobile-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.mobile-toolbar.visible {
  transform: translateY(0);
}

.toolbar-container {
  padding: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.swipe-indicator {
  text-align: center;
  margin-bottom: 8px;
  opacity: 0.7;
  animation: fadeInOut 3s ease-out;
}

.swipe-line {
  width: 40px;
  height: 3px;
  background: #9ca3af;
  margin: 0 auto 4px;
  border-radius: 2px;
}

.swipe-text {
  font-size: 12px;
  color: #6b7280;
}

.tool-sections {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tool-sections::-webkit-scrollbar {
  display: none;
}

.tool-section {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 0 8px;
  min-width: 100%;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.tool-section.active {
  opacity: 1;
}

.tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  padding: 12px;
  min-width: 64px;
  min-height: 64px;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.tool-button:active {
  transform: scale(0.95);
  background: #e5e7eb;
}

.tool-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tool-button.primary:active {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.tool-button.action {
  background: #fef3c7;
  color: #92400e;
}

.tool-button.action:active {
  background: #fde68a;
}

.tool-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.tool-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.section-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #667eea;
  transform: scale(1.2);
}

.quick-actions-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
}

.fab-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.fab-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.fab-icon {
  font-size: 20px;
  color: white;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(10px); }
  50% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

/* Responsive adjustments */
@media (max-width: 375px) {
  .tool-button {
    min-width: 56px;
    min-height: 56px;
    padding: 8px;
  }
  
  .tool-icon {
    font-size: 16px;
  }
  
  .tool-label {
    font-size: 9px;
  }
}

@media (orientation: landscape) {
  .mobile-toolbar {
    position: fixed;
    bottom: auto;
    top: 0;
    left: 0;
    right: auto;
    width: 80px;
    height: 100vh;
    transform: translateX(-100%);
    border-top: none;
    border-right: 1px solid #e5e7eb;
    box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-toolbar.visible {
    transform: translateX(0);
  }
  
  .toolbar-container {
    padding: 12px 8px;
    height: 100%;
    overflow-y: auto;
  }
  
  .tool-sections {
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;
  }
  
  .tool-section {
    flex-direction: column;
    min-width: auto;
    padding: 8px 0;
  }
  
  .tool-button {
    min-width: 48px;
    min-height: 48px;
    margin-bottom: 4px;
  }
  
  .section-indicators {
    flex-direction: column;
    margin-top: 8px;
    margin-left: 0;
  }
  
  .quick-actions-fab {
    bottom: auto;
    top: 20px;
    right: auto;
    left: 20px;
  }
}
</style>