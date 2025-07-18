<template>
  <div class="mobile-onboarding" v-if="isVisible" @click="handleBackgroundClick">
    <div class="onboarding-content" @click.stop>
      <!-- Progress indicator -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <span class="progress-text">{{ currentStep + 1 }} / {{ steps.length }}</span>
      </div>
      
      <!-- Step content -->
      <div class="step-content">
        <div class="step-animation">
          <div class="animation-container" :class="steps[currentStep].animation">
            <component :is="steps[currentStep].icon" class="step-icon" />
          </div>
        </div>
        
        <h2 class="step-title">{{ steps[currentStep].title }}</h2>
        <p class="step-description">{{ steps[currentStep].description }}</p>
        
        <!-- Interactive demo -->
        <div class="step-demo" v-if="steps[currentStep].demo">
          <component :is="steps[currentStep].demo" @demo-complete="handleDemoComplete" />
        </div>
        
        <!-- Tips for current step -->
        <div class="step-tips" v-if="steps[currentStep].tips">
          <h4>💡 Consejos:</h4>
          <ul>
            <li v-for="tip in steps[currentStep].tips" :key="tip">{{ tip }}</li>
          </ul>
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="navigation">
        <button 
          class="nav-button secondary"
          @click="skipOnboarding"
          v-if="currentStep === 0"
        >
          Saltar tutorial
        </button>
        
        <button 
          class="nav-button secondary"
          @click="previousStep"
          v-if="currentStep > 0"
        >
          Anterior
        </button>
        
        <button 
          class="nav-button primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          {{ currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente' }}
        </button>
      </div>
      
      <!-- Step indicators -->
      <div class="step-indicators">
        <div 
          v-for="(step, index) in steps"
          :key="index"
          class="indicator"
          :class="{ 
            'active': index === currentStep,
            'completed': index < currentStep
          }"
          @click="goToStep(index)"
        >
          <span v-if="index < currentStep">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTouchGestures } from '~/composables/useTouchGestures'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  autoStart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'complete', 'skip'])

const { lightHaptic, mediumHaptic } = useTouchGestures()

const currentStep = ref(0)
const canProceed = ref(true)
const demoCompleted = ref(false)

const steps = [
  {
    title: '¡Bienvenido al Editor Móvil!',
    description: 'Diseña tu tabla personalizada desde tu teléfono. Te mostraremos cómo usar todas las herramientas.',
    icon: 'WelcomeIcon',
    animation: 'welcome-bounce',
    tips: [
      'Puedes usar gestos táctiles para navegar',
      'Todas las herramientas están optimizadas para móvil',
      'Tus diseños se guardan automáticamente'
    ]
  },
  {
    title: 'Navegación Táctil',
    description: 'Usa gestos para moverte por la aplicación. Desliza para cambiar herramientas y pellizca para hacer zoom.',
    icon: 'TouchIcon',
    animation: 'touch-demo',
    demo: 'TouchDemo',
    tips: [
      'Desliza hacia la izquierda/derecha en la barra de herramientas',
      'Pellizca para hacer zoom en el canvas',
      'Mantén presionado para opciones adicionales'
    ]
  },
  {
    title: 'Herramientas Esenciales',
    description: 'Accede rápidamente a texto, colores, imágenes y emojis desde la barra de herramientas inferior.',
    icon: 'ToolsIcon',
    animation: 'tools-carousel',
    demo: 'ToolsDemo',
    tips: [
      'Las herramientas esenciales están siempre visibles',
      'Desliza para ver herramientas avanzadas',
      'Toca y mantén para ver descripciones'
    ]
  },
  {
    title: 'Cámara y Fotos',
    description: 'Toma fotos directamente o selecciona desde tu galería para personalizar tu diseño.',
    icon: 'CameraIcon',
    animation: 'camera-flash',
    demo: 'CameraDemo',
    tips: [
      'Toca el icono de cámara para acceder',
      'Puedes tomar fotos o seleccionar de la galería',
      'Las imágenes se optimizan automáticamente'
    ]
  },
  {
    title: 'Modo Offline',
    description: 'Trabaja sin conexión. Tus cambios se sincronizarán cuando vuelvas a conectarte.',
    icon: 'OfflineIcon',
    animation: 'offline-sync',
    tips: [
      'Todos los diseños se guardan localmente',
      'Las herramientas básicas funcionan offline',
      'La sincronización es automática'
    ]
  },
  {
    title: '¡Listo para Empezar!',
    description: 'Ya tienes todo lo necesario para crear diseños increíbles. ¡Comienza a diseñar tu tabla perfecta!',
    icon: 'SuccessIcon',
    animation: 'success-celebration',
    tips: [
      'Guarda tus diseños favoritos',
      'Comparte con amigos fácilmente',
      'Explora plantillas para inspirarte'
    ]
  }
]

const progressPercentage = computed(() => {
  return ((currentStep.value + 1) / steps.length) * 100
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    mediumHaptic()
    resetStepState()
  } else {
    completeOnboarding()
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    lightHaptic()
    resetStepState()
  }
}

const goToStep = (index) => {
  if (index <= currentStep.value) {
    currentStep.value = index
    lightHaptic()
    resetStepState()
  }
}

const resetStepState = () => {
  canProceed.value = true
  demoCompleted.value = false
}

const handleDemoComplete = () => {
  demoCompleted.value = true
  canProceed.value = true
  mediumHaptic()
}

const skipOnboarding = () => {
  emit('skip')
  emit('close')
}

const completeOnboarding = () => {
  emit('complete')
  emit('close')
}

const handleBackgroundClick = () => {
  // Optional: close on background click
  // emit('close')
}

// Initialize
onMounted(() => {
  if (props.autoStart) {
    lightHaptic()
  }
})
</script>

<style scoped>
.mobile-onboarding {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.onboarding-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 100%;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.step-content {
  text-align: center;
  margin-bottom: 32px;
}

.step-animation {
  margin-bottom: 24px;
}

.animation-container {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.animation-container.welcome-bounce {
  animation: welcomeBounce 2s ease-in-out infinite;
}

.animation-container.touch-demo {
  animation: touchDemo 3s ease-in-out infinite;
}

.animation-container.tools-carousel {
  animation: toolsCarousel 4s ease-in-out infinite;
}

.animation-container.camera-flash {
  animation: cameraFlash 2s ease-in-out infinite;
}

.animation-container.offline-sync {
  animation: offlineSync 3s ease-in-out infinite;
}

.animation-container.success-celebration {
  animation: successCelebration 2s ease-in-out infinite;
}

.step-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.step-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 20px;
}

.step-demo {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.step-tips {
  background: #fffbeb;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
}

.step-tips h4 {
  color: #92400e;
  margin-bottom: 8px;
}

.step-tips ul {
  list-style: none;
  padding: 0;
}

.step-tips li {
  color: #78350f;
  margin-bottom: 4px;
  padding-left: 16px;
  position: relative;
}

.step-tips li:before {
  content: '→';
  position: absolute;
  left: 0;
}

.navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.nav-button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.nav-button.primary:active:not(:disabled) {
  transform: translateY(1px);
}

.nav-button.secondary {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.nav-button.secondary:active {
  background: #f9fafb;
}

.step-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
}

.indicator.completed {
  background: #10b981;
  color: white;
}

/* Animations */
@keyframes welcomeBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes touchDemo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes toolsCarousel {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}

@keyframes cameraFlash {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0.3; }
}

@keyframes offlineSync {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

@keyframes successCelebration {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  75% { transform: scale(1.1) rotate(-5deg); }
}

/* Responsive adjustments */
@media (max-width: 375px) {
  .onboarding-content {
    padding: 16px;
  }
  
  .step-title {
    font-size: 20px;
  }
  
  .step-description {
    font-size: 14px;
  }
  
  .animation-container {
    width: 60px;
    height: 60px;
  }
  
  .step-icon {
    width: 24px;
    height: 24px;
  }
}

@media (orientation: landscape) {
  .mobile-onboarding {
    align-items: flex-start;
    padding: 10px;
  }
  
  .onboarding-content {
    max-height: 95vh;
    margin-top: 10px;
  }
  
  .step-animation {
    margin-bottom: 16px;
  }
  
  .animation-container {
    width: 60px;
    height: 60px;
  }
}
</style>