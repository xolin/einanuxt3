<template>
  <Teleport to="body">
    <div 
      v-if="isVisible" 
      class="toast-container" 
      :class="positionClass"
    >
      <div 
        class="toast" 
        :class="[typeClass, { 'toast-entering': isEntering, 'toast-leaving': isLeaving }]"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="toast-icon">
          <span class="material-symbols-sharp">{{ iconName }}</span>
        </div>
        <div class="toast-content">
          <div v-if="title" class="toast-title">{{ title }}</div>
          <div class="toast-message">{{ message }}</div>
        </div>
        <button 
          v-if="closable" 
          @click="close" 
          class="toast-close"
          aria-label="Cerrar notificación"
        >
          <span class="material-symbols-sharp">close</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success',
    validator: value => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 4000
  },
  position: {
    type: String,
    default: 'top-right',
    validator: value => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const isEntering = ref(false)
const isLeaving = ref(false)
let autoCloseTimeout = null

const typeClass = computed(() => `toast-${props.type}`)
const positionClass = computed(() => `toast-${props.position}`)

const iconName = computed(() => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[props.type] || 'info'
})

const close = () => {
  isLeaving.value = true
  setTimeout(() => {
    emit('close')
  }, 300)
}

// Handle visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    isEntering.value = true
    
    // Remove entering class after animation
    setTimeout(() => {
      isEntering.value = false
    }, 300)
    
    // Set auto-close timer
    if (props.duration > 0) {
      autoCloseTimeout = setTimeout(() => {
        close()
      }, props.duration)
    }
  } else {
    isEntering.value = false
    isLeaving.value = false
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout)
      autoCloseTimeout = null
    }
  }
})

onUnmounted(() => {
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 10000;
  pointer-events: none;
}

.toast-top-right {
  top: 20px;
  right: 20px;
}

.toast-top-left {
  top: 20px;
  left: 20px;
}

.toast-bottom-right {
  bottom: 20px;
  right: 20px;
}

.toast-bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast-top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast {
  display: flex;
  align-items: flex-start;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 16px;
  max-width: 400px;
  min-width: 300px;
  margin-bottom: 12px;
  pointer-events: auto;
  border-left: 4px solid;
  animation: toastSlideIn 0.3s ease-out;
}

.toast-entering {
  animation: toastSlideIn 0.3s ease-out;
}

.toast-leaving {
  animation: toastSlideOut 0.3s ease-in;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  margin-right: 12px;
  margin-top: 2px;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  font-size: 14px;
}

.toast-message {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  margin: -4px -4px -4px 8px;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
}

.toast-close:hover {
  color: #6b7280;
  background-color: #f3f4f6;
}

.toast-close .material-symbols-sharp {
  font-size: 18px;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .toast-container {
    left: 10px !important;
    right: 10px !important;
    transform: none !important;
  }
  
  .toast {
    min-width: unset;
    width: 100%;
    margin-bottom: 8px;
  }
  
  .toast-title {
    font-size: 13px;
  }
  
  .toast-message {
    font-size: 13px;
  }
}

/* Animations for different positions */
.toast-top-left .toast-entering,
.toast-bottom-left .toast-entering {
  animation: toastSlideInLeft 0.3s ease-out;
}

.toast-top-left .toast-leaving,
.toast-bottom-left .toast-leaving {
  animation: toastSlideOutLeft 0.3s ease-in;
}

.toast-top-center .toast-entering,
.toast-bottom-center .toast-entering {
  animation: toastSlideInUp 0.3s ease-out;
}

.toast-top-center .toast-leaving,
.toast-bottom-center .toast-leaving {
  animation: toastSlideOutUp 0.3s ease-in;
}

@keyframes toastSlideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toastSlideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@keyframes toastSlideInUp {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastSlideOutUp {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
</style>