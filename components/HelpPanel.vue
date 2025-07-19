<template>
  <div class="help-panel">
    <!-- Toggle Button -->
    <button
      class="fixed top-1/2 right-0 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-lg shadow-lg z-40 transition-colors duration-200"
      :class="{ 'right-80': isOpen }"
      @click="togglePanel"
    >
      <span class="material-symbols-sharp text-xl">
        {{ isOpen ? 'close' : 'help' }}
      </span>
    </button>

    <!-- Panel -->
    <div
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
      class="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-30 transform transition-transform duration-300 overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Guía de Uso</h2>
          <button 
            class="text-gray-500 hover:text-gray-700 p-1"
            @click="closePanel"
          >
            <span class="material-symbols-sharp">close</span>
          </button>
        </div>

        <!-- Quick Start -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">🚀 Inicio Rápido</h3>
          <div class="space-y-3">
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm text-blue-800">
                <strong>1.</strong> Elige un color de fondo con 
                <span class="inline-flex items-center px-1 bg-blue-200 rounded">
                  <span class="material-symbols-sharp text-sm">palette</span>
                </span>
              </p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <p class="text-sm text-green-800">
                <strong>2.</strong> Añade texto con 
                <span class="inline-flex items-center px-1 bg-green-200 rounded">
                  <span class="material-symbols-sharp text-sm">text_fields</span>
                </span>
              </p>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg">
              <p class="text-sm text-purple-800">
                <strong>3.</strong> Sube imágenes con 
                <span class="inline-flex items-center px-1 bg-purple-200 rounded">
                  <span class="material-symbols-sharp text-sm">add_photo_alternate</span>
                </span>
              </p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <p class="text-sm text-yellow-800">
                <strong>4.</strong> Añade emojis con 
                <span class="inline-flex items-center px-1 bg-yellow-200 rounded">
                  <span class="material-symbols-sharp text-sm">add_reaction</span>
                </span>
              </p>
            </div>
            <div class="bg-red-50 p-3 rounded-lg">
              <p class="text-sm text-red-800">
                <strong>5.</strong> Descarga tu diseño con 
                <span class="inline-flex items-center px-1 bg-red-200 rounded">
                  <span class="material-symbols-sharp text-sm">download</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Tools Guide -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">🛠️ Herramientas</h3>
          <div class="space-y-3">
            <div class="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span class="material-symbols-sharp text-blue-600">palette</span>
              <div>
                <h4 class="font-medium text-gray-800">Colores</h4>
                <p class="text-xs text-gray-600">Cambia el color de fondo de tu tabla</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span class="material-symbols-sharp text-green-600">text_fields</span>
              <div>
                <h4 class="font-medium text-gray-800">Texto</h4>
                <p class="text-xs text-gray-600">Añade texto editable a tu diseño</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span class="material-symbols-sharp text-purple-600">add_photo_alternate</span>
              <div>
                <h4 class="font-medium text-gray-800">Imágenes</h4>
                <p class="text-xs text-gray-600">Sube tus propias imágenes (PNG, JPG)</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span class="material-symbols-sharp text-yellow-600">add_reaction</span>
              <div>
                <h4 class="font-medium text-gray-800">Emojis</h4>
                <p class="text-xs text-gray-600">Explora nuestra colección de emojis</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span class="material-symbols-sharp text-gray-600">zoom_in</span>
              <div>
                <h4 class="font-medium text-gray-800">Zoom</h4>
                <p class="text-xs text-gray-600">Acerca o aleja la vista del canvas</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span class="material-symbols-sharp text-red-600">download</span>
              <div>
                <h4 class="font-medium text-gray-800">Descargar</h4>
                <p class="text-xs text-gray-600">Genera y descarga tu diseño final</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">💡 Consejos</h3>
          <div class="space-y-2">
            <div class="bg-blue-50 p-3 rounded text-sm text-blue-800">
              <strong>Tip:</strong> Mantén pulsado Shift mientras arrastras para mantener las proporciones
            </div>
            <div class="bg-green-50 p-3 rounded text-sm text-green-800">
              <strong>Tip:</strong> Haz doble clic en el texto para editarlo directamente
            </div>
            <div class="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
              <strong>Tip:</strong> Usa el zoom para trabajar con detalles precisos
            </div>
          </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">⌨️ Atajos de Teclado</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Deshacer</span>
              <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + Z</kbd>
            </div>
            <div class="flex justify-between">
              <span>Rehacer</span>
              <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + Y</kbd>
            </div>
            <div class="flex justify-between">
              <span>Eliminar</span>
              <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Delete</kbd>
            </div>
            <div class="flex justify-between">
              <span>Duplicar</span>
              <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + D</kbd>
            </div>
          </div>
        </div>

        <!-- Need Help -->
        <div class="bg-gray-100 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-800 mb-2">¿Necesitas más ayuda?</h3>
          <p class="text-sm text-gray-600 mb-3">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
          <a 
            href="mailto:support@einaskateco.com" 
            class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <span class="material-symbols-sharp mr-1 text-sm">email</span>
            Contactar Soporte
          </a>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-25 z-20"
      @click="closePanel"
    ></div>
  </div>
</template>

<script setup>
const isOpen = ref(false)

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}

// Close panel on escape key
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    closePanel()
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
.help-panel {
  font-family: 'Source Sans Pro', sans-serif;
}

kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}
</style>