<template>
  <div v-if="showWelcome" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">¡Bienvenido al Editor de Tablas!</h2>
            <p class="text-blue-100 mt-1">Crea tu tabla personalizada en minutos</p>
          </div>
          <button 
            class="text-blue-100 hover:text-white p-1"
            title="Cerrar"
            @click="skipTutorial"
          >
            <span class="material-symbols-sharp text-xl">close</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Step indicator -->
        <div class="flex justify-center mb-6">
          <div class="flex space-x-2">
            <div 
              v-for="i in totalSteps" 
              :key="i"
              :class="i <= currentStep ? 'bg-blue-600' : 'bg-gray-300'"
              class="w-3 h-3 rounded-full transition-colors duration-200"
            ></div>
          </div>
          <span class="ml-3 text-sm text-gray-600">{{ currentStep }}/{{ totalSteps }}</span>
        </div>

        <!-- Step 1: Welcome -->
        <div v-if="currentStep === 1" class="text-center">
          <div class="text-6xl mb-4">🛹</div>
          <h3 class="text-xl font-semibold mb-3">¡Diseña la tabla de tus sueños!</h3>
          <p class="text-gray-600 mb-6">
            Con nuestro editor intuitivo puedes crear diseños únicos usando colores, texto, imágenes y emojis.
          </p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-blue-800 text-sm">
              <strong>Tip:</strong> Puedes saltarte este tutorial y empezar a diseñar directamente, o seguir la guía paso a paso.
            </p>
          </div>
        </div>

        <!-- Step 2: Canvas -->
        <div v-if="currentStep === 2" class="text-center">
          <div class="text-6xl mb-4">🎨</div>
          <h3 class="text-xl font-semibold mb-3">El Canvas de Diseño</h3>
          <p class="text-gray-600 mb-4">
            Este es tu lienzo donde crearás tu diseño. La forma de tabla en el centro es donde aparecerán todos tus elementos.
          </p>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="text-gray-700 text-sm">
              <strong>Consejo:</strong> Puedes hacer zoom con las ruedas del ratón o usando los botones de zoom para trabajar con más detalle.
            </p>
          </div>
        </div>

        <!-- Step 3: Colors -->
        <div v-if="currentStep === 3" class="text-center">
          <div class="flex items-center justify-center mb-4">
            <span class="material-symbols-sharp text-blue-600 text-5xl">palette</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">Elige tu Color de Fondo</h3>
          <p class="text-gray-600 mb-4">
            Haz clic en el icono de paleta para elegir el color base de tu tabla. Puedes cambiar este color en cualquier momento.
          </p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-blue-800 text-sm">
              <strong>Tip:</strong> Elige colores que contrasten bien con el texto y las imágenes que añadas después.
            </p>
          </div>
        </div>

        <!-- Step 4: Text -->
        <div v-if="currentStep === 4" class="text-center">
          <div class="flex items-center justify-center mb-4">
            <span class="material-symbols-sharp text-green-600 text-5xl">text_fields</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">Añade Texto Personalizado</h3>
          <p class="text-gray-600 mb-4">
            Haz clic en el icono de texto para añadir palabras, frases o tu nombre. Puedes cambiar el color, tamaño y fuente.
          </p>
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-green-800 text-sm">
              <strong>Tip:</strong> Haz doble clic en cualquier texto para editarlo directamente en el canvas.
            </p>
          </div>
        </div>

        <!-- Step 5: Images -->
        <div v-if="currentStep === 5" class="text-center">
          <div class="flex items-center justify-center mb-4">
            <span class="material-symbols-sharp text-purple-600 text-5xl">add_photo_alternate</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">Sube tus Imágenes</h3>
          <p class="text-gray-600 mb-4">
            Añade tus propias fotos, logos o ilustraciones. Soportamos formatos JPG y PNG.
          </p>
          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-purple-800 text-sm">
              <strong>Tip:</strong> Las imágenes con fondo transparente (PNG) se ven mejor en los diseños.
            </p>
          </div>
        </div>

        <!-- Step 6: Emojis -->
        <div v-if="currentStep === 6" class="text-center">
          <div class="flex items-center justify-center mb-4">
            <span class="material-symbols-sharp text-yellow-600 text-5xl">add_reaction</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">Explora los Emojis</h3>
          <p class="text-gray-600 mb-4">
            Tenemos cientos de emojis organizados por categorías. Perfectos para darle personalidad a tu tabla.
          </p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-yellow-800 text-sm">
              <strong>Tip:</strong> Los emojis son vectoriales, así que mantienen su calidad al redimensionarlos.
            </p>
          </div>
        </div>

        <!-- Step 7: Download -->
        <div v-if="currentStep === 7" class="text-center">
          <div class="flex items-center justify-center mb-4">
            <span class="material-symbols-sharp text-red-600 text-5xl">download</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">Descarga tu Diseño</h3>
          <p class="text-gray-600 mb-4">
            Cuando estés satisfecho con tu creación, haz clic en descargar para obtener una imagen de alta calidad.
          </p>
          <div class="bg-red-50 p-4 rounded-lg">
            <p class="text-red-800 text-sm">
              <strong>Tip:</strong> La imagen se descarga lista para imprimir en tu tabla.
            </p>
          </div>
        </div>

        <!-- Step 8: Final -->
        <div v-if="currentStep === 8" class="text-center">
          <div class="text-6xl mb-4">🚀</div>
          <h3 class="text-xl font-semibold mb-3">¡Listo para Empezar!</h3>
          <p class="text-gray-600 mb-4">
            Ya conoces las herramientas básicas. Recuerda que puedes acceder a la ayuda en cualquier momento desde el panel lateral.
          </p>
          <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <p class="text-gray-700 text-sm">
              <strong>¿Necesitas ayuda?</strong> Haz clic en el icono de ayuda (?) en el lateral derecho para acceder a la guía completa.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center">
        <button 
          class="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm"
          @click="skipTutorial"
        >
          Saltar tutorial
        </button>
        
        <div class="flex space-x-3">
          <button 
            v-if="currentStep > 1"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm transition-colors"
            @click="previousStep"
          >
            Anterior
          </button>
          
          <button 
            v-if="currentStep < totalSteps"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
            @click="nextStep"
          >
            Siguiente
          </button>
          
          <button 
            v-if="currentStep === totalSteps"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm transition-colors"
            @click="finishTutorial"
          >
            ¡Empezar a Diseñar!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const showWelcome = ref(true)
const currentStep = ref(1)
const totalSteps = 8

// Check if user has seen tutorial before
onMounted(() => {
  const hasSeenTutorial = localStorage.getItem('einanuxt3-tutorial-seen')
  if (hasSeenTutorial) {
    showWelcome.value = false
  }
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipTutorial = () => {
  showWelcome.value = false
  localStorage.setItem('einanuxt3-tutorial-seen', 'true')
}

const finishTutorial = () => {
  showWelcome.value = false
  localStorage.setItem('einanuxt3-tutorial-seen', 'true')
}

// Handle escape key
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showWelcome.value) {
    skipTutorial()
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
.max-h-90vh {
  max-height: 90vh;
}
</style>