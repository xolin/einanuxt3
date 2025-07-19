<template>
  <div v-if="currentHint" class="contextual-hints">
    <div 
      class="hint-bubble" 
      :class="[positionClass, { 'hint-entering': isEntering }]"
      :style="hintStyle"
    >
      <div class="hint-content">
        <div class="hint-icon">{{ currentHint.icon }}</div>
        <div class="hint-text">
          <div class="hint-title">{{ currentHint.title }}</div>
          <div class="hint-message">{{ currentHint.message }}</div>
        </div>
        <button class="hint-close" @click="dismissHint">
          <span class="material-symbols-sharp">close</span>
        </button>
      </div>
      <div class="hint-arrow" :class="arrowClass"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hints: {
    type: Object,
    default: () => ({})
  },
  position: {
    type: String,
    default: 'top',
    validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
  }
})

const emit = defineEmits(['dismiss'])

const currentHint = ref(null)
const isEntering = ref(false)
const hintStyle = ref({})
let hintTimeout = null

const positionClass = computed(() => `hint-${props.position}`)
const arrowClass = computed(() => `arrow-${props.position}`)

// Default hint messages based on user actions
const defaultHints = {
  textAdded: {
    icon: '✍️',
    title: '¡Texto añadido!',
    message: 'Ahora puedes arrastrarlo para moverlo o hacer clic para editarlo.',
    duration: 4000
  },
  colorChanged: {
    icon: '🎨',
    title: '¡Color actualizado!',
    message: '¿Qué tal si añades algo de texto o un emoji para personalizar más?',
    duration: 3500
  },
  emojiAdded: {
    icon: '😊',
    title: '¡Emoji añadido!',
    message: 'Puedes redimensionarlo arrastrando las esquinas o moverlo por la tabla.',
    duration: 4000
  },
  imageUploaded: {
    icon: '📷',
    title: '¡Imagen subida!',
    message: 'La imagen se ha añadido a tu diseño. Puedes moverla y redimensionarla.',
    duration: 4000
  },
  objectSelected: {
    icon: '👆',
    title: 'Elemento seleccionado',
    message: 'Ahora puedes moverlo, redimensionarlo o cambiar su color.',
    duration: 3000
  },
  firstAction: {
    icon: '🚀',
    title: '¡Genial inicio!',
    message: 'Sigue añadiendo elementos para crear un diseño único.',
    duration: 3500
  },
  undoRedo: {
    icon: '↩️',
    title: 'Acción deshecha/rehecha',
    message: 'Puedes usar Ctrl+Z/Ctrl+Y para deshacer/rehacer cambios.',
    duration: 3000
  },
  readyToDownload: {
    icon: '⬇️',
    title: '¡Diseño completado!',
    message: 'Tu tabla se ve genial. ¿Listo para descargar tu diseño?',
    duration: 5000
  },
  zoomChanged: {
    icon: '🔍',
    title: 'Zoom ajustado',
    message: 'Usa el zoom para trabajar en detalles o ver el diseño completo.',
    duration: 2500
  },
  canvasEmpty: {
    icon: '🛹',
    title: 'Lienzo vacío',
    message: 'Comienza añadiendo un color de fondo, texto o imagen.',
    duration: 4000
  }
}

const showHint = (hintKey, customHint = null, targetElement = null) => {
  const hint = customHint || props.hints[hintKey] || defaultHints[hintKey]
  
  if (!hint) return
  
  // Clear existing hint
  if (currentHint.value) {
    dismissHint()
    return
  }
  
  currentHint.value = hint
  isEntering.value = true
  
  // Position hint relative to target element if provided
  if (targetElement) {
    nextTick(() => {
      positionHint(targetElement)
    })
  }
  
  // Remove entering animation
  setTimeout(() => {
    isEntering.value = false
  }, 300)
  
  // Auto-dismiss after duration
  if (hint.duration) {
    hintTimeout = setTimeout(() => {
      dismissHint()
    }, hint.duration)
  }
}

const dismissHint = () => {
  if (hintTimeout) {
    clearTimeout(hintTimeout)
    hintTimeout = null
  }
  
  currentHint.value = null
  isEntering.value = false
  hintStyle.value = {}
  
  emit('dismiss')
}

const positionHint = (targetElement) => {
  if (!targetElement || !currentHint.value) return
  
  const rect = targetElement.getBoundingClientRect()
  const hintElement = document.querySelector('.hint-bubble')
  
  if (!hintElement) return
  
  const hintRect = hintElement.getBoundingClientRect()
  
  let top, left
  
  switch (props.position) {
    case 'top':
      top = rect.top - hintRect.height - 10
      left = rect.left + (rect.width - hintRect.width) / 2
      break
    case 'bottom':
      top = rect.bottom + 10
      left = rect.left + (rect.width - hintRect.width) / 2
      break
    case 'left':
      top = rect.top + (rect.height - hintRect.height) / 2
      left = rect.left - hintRect.width - 10
      break
    case 'right':
      top = rect.top + (rect.height - hintRect.height) / 2
      left = rect.right + 10
      break
  }
  
  // Ensure hint stays within viewport
  const padding = 10
  left = Math.max(padding, Math.min(left, window.innerWidth - hintRect.width - padding))
  top = Math.max(padding, Math.min(top, window.innerHeight - hintRect.height - padding))
  
  hintStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 1001
  }
}

// Expose showHint method to parent
defineExpose({
  showHint,
  dismissHint
})

onUnmounted(() => {
  if (hintTimeout) {
    clearTimeout(hintTimeout)
  }
})
</script>

<style scoped>
.contextual-hints {
  position: relative;
  z-index: 1001;
}

.hint-bubble {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  max-width: 300px;
  padding: 0;
  animation: hintFadeIn 0.3s ease-out;
}

.hint-entering {
  animation: hintSlideIn 0.3s ease-out;
}

.hint-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.hint-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.hint-text {
  flex: 1;
  min-width: 0;
}

.hint-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
}

.hint-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.hint-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.hint-close:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.hint-close .material-symbols-sharp {
  font-size: 16px;
}

.hint-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

.hint-top .arrow-top {
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: white;
  border-bottom: none;
}

.hint-bottom .arrow-bottom {
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: white;
  border-top: none;
}

.hint-left .arrow-left {
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: white;
  border-right: none;
}

.hint-right .arrow-right {
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: white;
  border-left: none;
}

@keyframes hintFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hintSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .hint-bubble {
    max-width: 280px;
    font-size: 13px;
  }
  
  .hint-content {
    padding: 14px;
    gap: 10px;
  }
  
  .hint-icon {
    font-size: 1.25rem;
  }
  
  .hint-title {
    font-size: 13px;
  }
  
  .hint-message {
    font-size: 12px;
  }
}

/* Default positioning when no target element */
.hint-bubble:not([style*="position: fixed"]) {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
}

@media (max-width: 768px) {
  .hint-bubble:not([style*="position: fixed"]) {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>