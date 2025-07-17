# Technical Implementation Roadmap

## 🔧 **Technical Architecture for UX Improvements**

This document outlines the technical implementation details for each UX improvement phase.

---

## 📁 **File Structure Overview**

### **New Components to Create**
```
components/
├── UX/
│   ├── Tooltip.vue                 # Reusable tooltip component
│   ├── HelpPanel.vue              # Help documentation panel
│   ├── WelcomeModal.vue           # First-time user welcome
│   ├── Tutorial/
│   │   ├── TutorialOverlay.vue    # Interactive tutorial system
│   │   ├── TutorialStep.vue       # Individual tutorial steps
│   │   └── TutorialHighlight.vue  # Element highlighting
│   ├── LoadingSpinner.vue         # Loading state component
│   └── ConfirmationToast.vue      # Success/error messages
├── Templates/
│   ├── TemplateGallery.vue        # Pre-designed templates
│   ├── TemplateCard.vue           # Individual template preview
│   └── TemplateModal.vue          # Template selection modal
└── Preview/
    ├── SkateboardPreview3D.vue    # 3D preview component
    └── PrintPreview.vue           # Print preview modal
```

### **New Composables**
```
composables/
├── useTutorial.js                 # Tutorial state management
├── useTooltips.js                 # Tooltip positioning logic
├── useLocalStorage.js             # User preferences storage
├── useAnalytics.js                # Usage tracking
└── useKeyboardShortcuts.js        # Keyboard navigation
```

### **New Styles**
```
assets/css/
├── components/
│   ├── tooltip.css                # Tooltip styles
│   ├── tutorial.css               # Tutorial overlay styles
│   ├── help-panel.css             # Help panel styles
│   └── welcome-modal.css          # Welcome modal styles
└── utilities/
    ├── animations.css             # Reusable animations
    └── accessibility.css          # A11y improvements
```

---

## 🚀 **Phase 1: Core UX Components**

### **1.1 Tooltip System Implementation**

#### **Component: `components/UX/Tooltip.vue`**
```vue
<template>
  <div 
    class="tooltip-wrapper" 
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <slot></slot>
    <Teleport to="body">
      <div 
        v-if="isVisible" 
        ref="tooltipElement"
        class="tooltip-popup" 
        :class="[positionClass, themeClass]"
        :style="tooltipStyle"
        role="tooltip"
        :aria-describedby="tooltipId"
      >
        {{ text }}
        <kbd v-if="shortcut" class="tooltip-shortcut">{{ shortcut }}</kbd>
        <div class="tooltip-arrow" :class="arrowClass"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  shortcut: String,
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  theme: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  },
  delay: {
    type: Number,
    default: 500
  },
  disabled: Boolean
})

const isVisible = ref(false)
const tooltipElement = ref(null)
const tooltipStyle = ref({})
const showTimeout = ref(null)
const hideTimeout = ref(null)

const tooltipId = computed(() => `tooltip-${Math.random().toString(36).substr(2, 9)}`)
const positionClass = computed(() => `tooltip-${props.position}`)
const themeClass = computed(() => `tooltip-${props.theme}`)
const arrowClass = computed(() => `arrow-${props.position}`)

const handleMouseEnter = () => {
  if (props.disabled) return
  clearTimeout(hideTimeout.value)
  showTimeout.value = setTimeout(() => {
    showTooltip()
  }, props.delay)
}

const handleMouseLeave = () => {
  clearTimeout(showTimeout.value)
  hideTimeout.value = setTimeout(() => {
    hideTooltip()
  }, 100)
}

const handleFocus = () => {
  if (props.disabled) return
  showTooltip()
}

const handleBlur = () => {
  hideTooltip()
}

const showTooltip = async () => {
  isVisible.value = true
  await nextTick()
  calculatePosition()
}

const hideTooltip = () => {
  isVisible.value = false
}

const calculatePosition = () => {
  if (!tooltipElement.value) return
  
  const trigger = tooltipElement.value.previousElementSibling
  const tooltip = tooltipElement.value
  const triggerRect = trigger.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  
  let top, left
  
  switch (props.position) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - 8
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + 8
      break
  }
  
  // Viewport boundary checks
  const padding = 8
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))
  
  tooltipStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999
  }
}

onUnmounted(() => {
  clearTimeout(showTimeout.value)
  clearTimeout(hideTimeout.value)
})
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-popup {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease-out;
  max-width: 280px;
  word-wrap: break-word;
  white-space: normal;
}

.tooltip-dark {
  background: #1f2937;
  color: white;
}

.tooltip-light {
  background: white;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.tooltip-shortcut {
  margin-left: 8px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  font-size: 11px;
  font-family: monospace;
}

.tooltip-light .tooltip-shortcut {
  background: #f3f4f6;
  color: #6b7280;
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.arrow-top {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #1f2937;
}

.arrow-bottom {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #1f2937;
}

.arrow-left {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #1f2937;
}

.arrow-right {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #1f2937;
}

.tooltip-light .arrow-top {
  border-top-color: white;
}

.tooltip-light .arrow-bottom {
  border-bottom-color: white;
}

.tooltip-light .arrow-left {
  border-left-color: white;
}

.tooltip-light .arrow-right {
  border-right-color: white;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .tooltip-popup {
    font-size: 12px;
    padding: 6px 10px;
    max-width: 200px;
  }
}
</style>
```

#### **Composable: `composables/useTooltips.js`**
```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export const useTooltips = () => {
  const isEnabled = ref(true)
  const globalDelay = ref(500)
  
  const disableTooltips = () => {
    isEnabled.value = false
  }
  
  const enableTooltips = () => {
    isEnabled.value = true
  }
  
  const setGlobalDelay = (delay) => {
    globalDelay.value = delay
  }
  
  // Disable tooltips on touch devices for better UX
  const handleTouchStart = () => {
    disableTooltips()
  }
  
  const handleMouseMove = () => {
    enableTooltips()
  }
  
  onMounted(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
  })
  
  onUnmounted(() => {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('mousemove', handleMouseMove)
  })
  
  return {
    isEnabled,
    globalDelay,
    disableTooltips,
    enableTooltips,
    setGlobalDelay
  }
}
```

### **1.2 Help Panel Implementation**

#### **Component: `components/UX/HelpPanel.vue`**
```vue
<template>
  <Teleport to="body">
    <div v-if="isVisible" class="help-panel-overlay" @click="handleOverlayClick">
      <div 
        ref="panelElement"
        class="help-panel" 
        :class="{ 'panel-entering': isEntering }"
        @click.stop
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="help-header">
          <h2 :id="titleId">{{ title }}</h2>
          <button 
            @click="close" 
            class="close-btn"
            aria-label="Close help panel"
          >
            <span class="material-symbols-sharp">close</span>
          </button>
        </div>
        
        <div class="help-content">
          <div class="help-search" v-if="searchable">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search help topics..."
              class="search-input"
            >
          </div>
          
          <div class="help-sections">
            <div 
              v-for="section in filteredSections" 
              :key="section.id"
              class="help-section"
            >
              <button 
                @click="toggleSection(section.id)"
                class="section-header"
                :aria-expanded="expandedSections.includes(section.id)"
              >
                <span class="section-icon">{{ section.icon }}</span>
                <span class="section-title">{{ section.title }}</span>
                <span 
                  class="expand-icon material-symbols-sharp"
                  :class="{ expanded: expandedSections.includes(section.id) }"
                >
                  expand_more
                </span>
              </button>
              
              <div 
                v-if="expandedSections.includes(section.id)"
                class="section-content"
              >
                <p v-if="section.description">{{ section.description }}</p>
                
                <div v-if="section.steps" class="steps-list">
                  <div 
                    v-for="(step, index) in section.steps" 
                    :key="index"
                    class="step-item"
                  >
                    <span class="step-number">{{ index + 1 }}</span>
                    <span class="step-text">{{ step }}</span>
                  </div>
                </div>
                
                <div v-if="section.shortcuts" class="shortcuts-list">
                  <h4>Keyboard Shortcuts:</h4>
                  <div 
                    v-for="shortcut in section.shortcuts" 
                    :key="shortcut.key"
                    class="shortcut-item"
                  >
                    <kbd class="shortcut-key">{{ shortcut.key }}</kbd>
                    <span class="shortcut-desc">{{ shortcut.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-footer">
            <p>Need more help? Contact support at support@example.com</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  title: {
    type: String,
    default: 'How to Use the Skateboard Designer'
  },
  searchable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

// Component state
const panelElement = ref(null)
const isEntering = ref(false)
const searchQuery = ref('')
const expandedSections = ref(['colors']) // Default first section open

// Help sections data
const helpSections = ref([
  {
    id: 'colors',
    icon: '🎨',
    title: 'Customize Colors',
    description: 'Change the appearance of your skateboard with custom colors.',
    steps: [
      'Click the deck color button to change the background',
      'Select text and click the text color button to change text color',
      'Colors update in real-time on your design'
    ],
    shortcuts: [
      { key: 'C', description: 'Open color picker' }
    ]
  },
  {
    id: 'text',
    icon: '📝',
    title: 'Add and Edit Text',
    description: 'Add custom text to personalize your skateboard design.',
    steps: [
      'Click the text button to add new text',
      'Click on existing text to edit it',
      'Use the text color picker to change text color',
      'Drag text to reposition it on the board'
    ],
    shortcuts: [
      { key: 'T', description: 'Add new text' },
      { key: 'Enter', description: 'Finish editing text' },
      { key: 'Escape', description: 'Cancel text editing' }
    ]
  },
  {
    id: 'emojis',
    icon: '😊',
    title: 'Add Emojis',
    description: 'Browse through hundreds of emojis organized by category.',
    steps: [
      'Click the emoji button to open the picker',
      'Use category tabs to find the perfect emoji',
      'Click any emoji to add it to your design',
      'Drag emojis to reposition them'
    ],
    shortcuts: [
      { key: 'E', description: 'Open emoji picker' }
    ]
  },
  {
    id: 'images',
    icon: '📁',
    title: 'Upload Custom Images',
    description: 'Add your own images to create unique designs.',
    steps: [
      'Click the upload button to select images',
      'Supported formats: PNG, JPG, GIF',
      'Images are automatically resized to fit',
      'Drag images to position them on your board'
    ],
    shortcuts: [
      { key: 'Ctrl+U', description: 'Upload image' },
      { key: 'Ctrl+V', description: 'Paste image from clipboard' }
    ]
  },
  {
    id: 'download',
    icon: '⬇️',
    title: 'Download Your Design',
    description: 'Export your finished skateboard design as a high-quality image.',
    steps: [
      'Complete your design',
      'Click the download button',
      'Choose your preferred format and quality',
      'Save the file to your device'
    ],
    shortcuts: [
      { key: 'Ctrl+D', description: 'Download design' },
      { key: 'Ctrl+S', description: 'Save design' }
    ]
  },
  {
    id: 'navigation',
    icon: '🧭',
    title: 'Navigation & Controls',
    description: 'Learn how to navigate and control the design canvas.',
    steps: [
      'Use zoom buttons to get a closer look',
      'Click and drag to move objects around',
      'Use undo/redo to fix mistakes',
      'Right-click objects for more options'
    ],
    shortcuts: [
      { key: 'Ctrl+Z', description: 'Undo last action' },
      { key: 'Ctrl+Y', description: 'Redo action' },
      { key: '+', description: 'Zoom in' },
      { key: '-', description: 'Zoom out' },
      { key: 'Delete', description: 'Delete selected object' }
    ]
  }
])

const titleId = computed(() => `help-title-${Math.random().toString(36).substr(2, 9)}`)

const filteredSections = computed(() => {
  if (!searchQuery.value) return helpSections.value
  
  const query = searchQuery.value.toLowerCase()
  return helpSections.value.filter(section => 
    section.title.toLowerCase().includes(query) ||
    section.description.toLowerCase().includes(query) ||
    section.steps?.some(step => step.toLowerCase().includes(query))
  )
})

const toggleSection = (sectionId) => {
  const index = expandedSections.value.indexOf(sectionId)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(sectionId)
  }
}

const handleOverlayClick = () => {
  close()
}

const close = () => {
  emit('close')
}

// Handle visibility changes
watch(() => props.isVisible, async (newValue) => {
  if (newValue) {
    isEntering.value = true
    await nextTick()
    // Focus the panel for accessibility
    panelElement.value?.focus()
    
    // Remove entering class after animation
    setTimeout(() => {
      isEntering.value = false
    }, 300)
  }
})

// Keyboard navigation
const handleKeydown = (event) => {
  if (!props.isVisible) return
  
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Help Panel Styles */
.help-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: overlayFadeIn 0.3s ease;
}

.help-panel {
  background: white;
  border-radius: 16px;
  max-width: 700px;
  max-height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform: scale(1) translateY(0);
  animation: panelSlideIn 0.3s ease;
}

.panel-entering {
  transform: scale(0.9) translateY(-20px);
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 16px 16px 0 0;
}

.help-header h2 {
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #6b7280;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.help-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.help-search {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.help-sections {
  padding: 8px 0;
}

.help-section {
  border-bottom: 1px solid #f3f4f6;
}

.section-header {
  width: 100%;
  padding: 16px 24px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
}

.section-header:hover {
  background: #f9fafb;
}

.section-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.section-title {
  font-weight: 600;
  color: #111827;
  flex: 1;
}

.expand-icon {
  color: #6b7280;
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.section-content {
  padding: 0 24px 20px 60px;
  color: #6b7280;
  line-height: 1.6;
}

.section-content p {
  margin: 0 0 16px 0;
}

.steps-list {
  margin: 16px 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.step-number {
  background: #3b82f6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-text {
  flex: 1;
  padding-top: 2px;
}

.shortcuts-list {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.shortcuts-list h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.shortcut-key {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 12px;
  color: #374151;
  min-width: 40px;
  text-align: center;
}

.shortcut-desc {
  font-size: 14px;
  color: #6b7280;
}

.help-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  text-align: center;
  border-radius: 0 0 16px 16px;
}

.help-footer p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Animations */
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes panelSlideIn {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .help-panel-overlay {
    padding: 10px;
  }
  
  .help-panel {
    max-height: 90vh;
    border-radius: 12px;
  }
  
  .help-header {
    padding: 20px;
  }
  
  .help-header h2 {
    font-size: 18px;
  }
  
  .help-search {
    padding: 16px 20px 12px;
  }
  
  .section-header {
    padding: 16px 20px;
  }
  
  .section-content {
    padding: 0 20px 16px 52px;
  }
  
  .help-footer {
    padding: 16px 20px;
  }
}
</style>
```

---

## 📱 **Phase 2: Mobile Optimization**

### **2.1 Touch-Optimized Components**

#### **Mobile Toolbar Component: `components/Mobile/MobileToolbar.vue`**
```vue
<template>
  <div class="mobile-toolbar" :class="{ 'toolbar-collapsed': isCollapsed }">
    <div class="toolbar-header">
      <button @click="toggleCollapse" class="collapse-btn">
        <span class="material-symbols-sharp">
          {{ isCollapsed ? 'expand_less' : 'expand_more' }}
        </span>
      </button>
      <h3>Design Tools</h3>
    </div>
    
    <div class="toolbar-content">
      <div class="tool-sections">
        <div v-for="section in toolSections" :key="section.id" class="tool-section">
          <h4 class="section-title">{{ section.title }}</h4>
          <div class="tool-grid">
            <button 
              v-for="tool in section.tools" 
              :key="tool.id"
              class="tool-btn"
              :class="{ active: activeTool === tool.id }"
              @click="selectTool(tool)"
            >
              <span class="tool-icon">{{ tool.icon }}</span>
              <span class="tool-label">{{ tool.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeTool: String
})

const emit = defineEmits(['tool-selected', 'toggle-collapse'])

const isCollapsed = ref(false)

const toolSections = ref([
  {
    id: 'colors',
    title: 'Colors',
    tools: [
      { id: 'deck-color', icon: '🎨', label: 'Deck Color' },
      { id: 'text-color', icon: '📝', label: 'Text Color' }
    ]
  },
  {
    id: 'content',
    title: 'Content',
    tools: [
      { id: 'add-text', icon: '📝', label: 'Add Text' },
      { id: 'emojis', icon: '😊', label: 'Emojis' },
      { id: 'upload', icon: '📁', label: 'Upload' }
    ]
  },
  {
    id: 'actions',
    title: 'Actions',
    tools: [
      { id: 'undo', icon: '↶', label: 'Undo' },
      { id: 'redo', icon: '↷', label: 'Redo' },
      { id: 'zoom-in', icon: '🔍+', label: 'Zoom In' },
      { id: 'zoom-out', icon: '🔍-', label: 'Zoom Out' },
      { id: 'download', icon: '⬇️', label: 'Download' }
    ]
  }
])

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle-collapse', isCollapsed.value)
}

const selectTool = (tool) => {
  emit('tool-selected', tool)
}
</script>

<style scoped>
.mobile-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  z-index: 1000;
  transition: transform 0.3s ease;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
}

.toolbar-collapsed {
  transform: translateY(calc(100% - 60px));
}

.toolbar-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
}

.collapse-btn {
  background: none;
  border: none;
  padding: 4px;
  margin-right: 12px;
  cursor: pointer;
  border-radius: 4px;
  color: #6b7280;
}

.collapse-btn:hover {
  background: #e5e7eb;
}

.toolbar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.toolbar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.tool-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.tool-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
}

.tool-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.tool-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.tool-icon {
  font-size: 20px;
}

.tool-label {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #374151;
}

.tool-btn.active .tool-label {
  color: #3b82f6;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .tool-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .tool-btn {
    padding: 12px 8px;
    min-height: 70px;
  }
  
  .tool-icon {
    font-size: 18px;
  }
  
  .tool-label {
    font-size: 11px;
  }
}
</style>
```

---

## 🎯 **Implementation Timeline**

### **Week 1: Core UX Components**
- **Day 1-2**: Tooltip system and integration
- **Day 3-4**: Help panel component
- **Day 5**: Welcome modal and onboarding
- **Day 6-7**: Testing and mobile optimization

### **Week 2: Advanced Features**
- **Day 1-2**: Interactive tutorial system
- **Day 3-4**: Template gallery
- **Day 5**: 3D preview component
- **Day 6-7**: Performance optimization and testing

### **Week 3: Polish and Integration**
- **Day 1-2**: Accessibility improvements
- **Day 3-4**: Analytics integration
- **Day 5**: User testing and feedback
- **Day 6-7**: Bug fixes and final polish

---

## 📊 **Performance Considerations**

### **Code Splitting**
```javascript
// Dynamic imports for large components
const TutorialOverlay = defineAsyncComponent(() => 
  import('~/components/Tutorial/TutorialOverlay.vue')
)

const TemplateGallery = defineAsyncComponent(() => 
  import('~/components/Templates/TemplateGallery.vue')
)
```

### **Memory Management**
```javascript
// Cleanup large objects when components unmount
onUnmounted(() => {
  // Clear tutorial data
  tutorialSteps.value = []
  
  // Remove event listeners
  document.removeEventListener('keydown', handleKeydown)
  
  // Clear timeouts
  clearTimeout(tooltipTimeout.value)
})
```

### **Lazy Loading**
```javascript
// Load help content on demand
const loadHelpContent = async () => {
  if (!helpSections.value.length) {
    const { default: helpData } = await import('~/data/help-sections.json')
    helpSections.value = helpData
  }
}
```

---

## 🔧 **Testing Strategy**

### **Unit Tests**
```javascript
// Tooltip component tests
describe('Tooltip Component', () => {
  test('shows tooltip on hover', async () => {
    const wrapper = mount(Tooltip, {
      props: { text: 'Test tooltip' },
      slots: { default: '<button>Test</button>' }
    })
    
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.tooltip-popup').isVisible()).toBe(true)
  })
})
```

### **E2E Tests**
```javascript
// User journey tests
test('complete design flow', async ({ page }) => {
  await page.goto('/editor')
  
  // Should see welcome modal
  await expect(page.locator('.welcome-modal')).toBeVisible()
  
  // Complete tutorial
  await page.click('[data-testid="start-tutorial"]')
  
  // Add text
  await page.click('[data-testid="add-text-btn"]')
  
  // Change colors
  await page.click('[data-testid="deck-color-btn"]')
  
  // Download
  await page.click('[data-testid="download-btn"]')
})
```

---

*This technical roadmap provides the detailed implementation structure needed to transform the user experience systematically.*
