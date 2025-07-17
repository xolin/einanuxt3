<template>
  <div v-if="isVisible" class="loading-spinner-overlay" :class="overlayClass">
    <div class="loading-spinner-container">
      <div class="loading-spinner" :class="sizeClass">
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
      <div v-if="showProgress" class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value)
  },
  overlay: {
    type: String,
    default: 'dark',
    validator: value => ['dark', 'light', 'transparent'].includes(value)
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100
  }
})

const sizeClass = computed(() => `spinner-${props.size}`)
const overlayClass = computed(() => `overlay-${props.overlay}`)
</script>

<style scoped>
.loading-spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.overlay-dark {
  background: rgba(0, 0, 0, 0.7);
}

.overlay-light {
  background: rgba(255, 255, 255, 0.9);
}

.overlay-transparent {
  background: rgba(0, 0, 0, 0.3);
}

.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  text-align: center;
}

.loading-spinner {
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
}

.spinner-small .spinner-circle {
  width: 8px;
  height: 8px;
}

.spinner-medium .spinner-circle {
  width: 12px;
  height: 12px;
}

.spinner-large .spinner-circle {
  width: 16px;
  height: 16px;
}

.spinner-circle {
  background: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-circle:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner-circle:nth-child(3) {
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

.loading-message {
  margin: 0 0 1rem 0;
  color: #374151;
  font-weight: 500;
  font-size: 16px;
}

.loading-progress {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .loading-spinner-container {
    margin: 1rem;
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
  }
  
  .loading-message {
    font-size: 14px;
  }
}
</style>