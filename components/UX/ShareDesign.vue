<template>
  <div v-if="isVisible" class="share-design-modal">
    <!-- Modal Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">Compartir Diseño</h2>
              <p class="text-purple-100 mt-1">{{ designName }}</p>
            </div>
            <button 
              @click="closeModal"
              class="text-purple-100 hover:text-white p-1"
              title="Cerrar"
            >
              <span class="material-symbols-sharp text-xl">close</span>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Quick Share Options -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Compartir Rápidamente</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <!-- Copy Link -->
              <button
                @click="copyShareLink"
                class="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span class="material-symbols-sharp text-2xl text-gray-600 mb-2">link</span>
                <span class="text-sm font-medium text-gray-700">Copiar Enlace</span>
              </button>

              <!-- Download Image -->
              <button
                @click="downloadImage"
                class="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span class="material-symbols-sharp text-2xl text-gray-600 mb-2">download</span>
                <span class="text-sm font-medium text-gray-700">Descargar</span>
              </button>

              <!-- Native Share (mobile) -->
              <button
                v-if="canShareNatively()"
                @click="shareNatively"
                class="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span class="material-symbols-sharp text-2xl text-gray-600 mb-2">share</span>
                <span class="text-sm font-medium text-gray-700">Compartir</span>
              </button>

              <!-- Email -->
              <button
                @click="shareViaEmail"
                class="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span class="material-symbols-sharp text-2xl text-gray-600 mb-2">email</span>
                <span class="text-sm font-medium text-gray-700">Email</span>
              </button>
            </div>
          </div>

          <!-- Social Media -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Redes Sociales</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <!-- Twitter -->
              <button
                @click="shareOnSocial('twitter')"
                class="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-sm">T</span>
                </div>
                <span class="text-sm font-medium text-gray-700">Twitter</span>
              </button>

              <!-- Facebook -->
              <button
                @click="shareOnSocial('facebook')"
                class="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-sm">f</span>
                </div>
                <span class="text-sm font-medium text-gray-700">Facebook</span>
              </button>

              <!-- WhatsApp -->
              <button
                @click="shareOnSocial('whatsapp')"
                class="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-sm">W</span>
                </div>
                <span class="text-sm font-medium text-gray-700">WhatsApp</span>
              </button>

              <!-- LinkedIn -->
              <button
                @click="shareOnSocial('linkedin')"
                class="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-sm">in</span>
                </div>
                <span class="text-sm font-medium text-gray-700">LinkedIn</span>
              </button>

              <!-- Telegram -->
              <button
                @click="shareOnSocial('telegram')"
                class="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-sm">t</span>
                </div>
                <span class="text-sm font-medium text-gray-700">Telegram</span>
              </button>

              <!-- Pinterest -->
              <button
                @click="shareOnSocial('pinterest')"
                class="flex items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-sm">P</span>
                </div>
                <span class="text-sm font-medium text-gray-700">Pinterest</span>
              </button>
            </div>
          </div>

          <!-- Share Link Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Enlace para Compartir</h3>
            <p class="text-sm text-gray-600 mb-3">
              Cualquier persona con este enlace puede ver tu diseño:
            </p>
            <div class="flex space-x-2">
              <input
                :value="shareableLink"
                readonly
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                @click="selectLink"
                ref="linkInput"
              />
              <button
                @click="copyShareLink"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <span class="material-symbols-sharp text-sm mr-1">content_copy</span>
                {{ linkCopied ? 'Copiado!' : 'Copiar' }}
              </button>
            </div>
          </div>

          <!-- QR Code Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Código QR</h3>
            <div class="flex items-center space-x-4">
              <div class="bg-white p-3 rounded-lg border">
                <img 
                  v-if="qrCodeUrl" 
                  :src="qrCodeUrl" 
                  alt="QR Code" 
                  class="w-24 h-24"
                />
                <div v-else class="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span class="text-gray-500 text-xs">QR</span>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-600 mb-2">
                  Escanea este código QR para acceder al diseño desde cualquier dispositivo móvil.
                </p>
                <button
                  @click="downloadQRCode"
                  class="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Descargar código QR
                </button>
              </div>
            </div>
          </div>

          <!-- Embed Code Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-800">Código de Inserción</h3>
              <button
                @click="showEmbedCode = !showEmbedCode"
                class="text-sm text-purple-600 hover:text-purple-800 underline"
              >
                {{ showEmbedCode ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
            
            <div v-if="showEmbedCode" class="space-y-3">
              <p class="text-sm text-gray-600">
                Copia este código para insertar tu diseño en una página web:
              </p>
              <textarea
                :value="embedCode"
                readonly
                class="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono resize-none"
                @click="selectEmbed"
                ref="embedInput"
              ></textarea>
              <button
                @click="copyEmbedCode"
                class="text-sm text-purple-600 hover:text-purple-800 underline"
              >
                {{ embedCopied ? 'Código copiado!' : 'Copiar código' }}
              </button>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="message" :class="[
            'p-4 rounded-lg flex items-center',
            messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          ]">
            <span class="material-symbols-sharp mr-2">
              {{ messageType === 'success' ? 'check_circle' : 'error' }}
            </span>
            {{ message }}
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div class="flex justify-between items-center">
            <p class="text-xs text-gray-500">
              Los diseños compartidos son públicos y pueden ser vistos por cualquier persona con el enlace.
            </p>
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useDesignSharing } from '~/composables/useDesignSharing'

const props = defineProps({
  isVisible: Boolean,
  design: Object,
  canvasRef: Object
})

const emit = defineEmits(['close'])

// Sharing composable
const {
  generateShareableLink,
  copyToClipboard,
  shareNative,
  openSocialShare,
  shareViaEmail: shareEmail,
  downloadForSharing,
  generateQRCode,
  canShareNatively
} = useDesignSharing()

// Component state
const linkCopied = ref(false)
const embedCopied = ref(false)
const showEmbedCode = ref(false)
const message = ref('')
const messageType = ref('success')
const linkInput = ref(null)
const embedInput = ref(null)

// Computed properties
const designName = computed(() => props.design?.name || 'Mi Diseño')

const shareableLink = computed(() => {
  if (!props.design) return ''
  return generateShareableLink(props.design)
})

const embedCode = computed(() => {
  if (!shareableLink.value) return ''
  return `<iframe src="${shareableLink.value}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`
})

const qrCodeUrl = computed(() => {
  if (!shareableLink.value) return null
  return generateQRCode(shareableLink.value)
})

// Methods
const closeModal = () => {
  emit('close')
  clearMessages()
}

const clearMessages = () => {
  message.value = ''
  linkCopied.value = false
  embedCopied.value = false
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const copyShareLink = async () => {
  const success = await copyToClipboard(shareableLink.value)
  if (success) {
    linkCopied.value = true
    showMessage('¡Enlace copiado al portapapeles!')
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } else {
    showMessage('Error al copiar el enlace', 'error')
  }
}

const copyEmbedCode = async () => {
  const success = await copyToClipboard(embedCode.value)
  if (success) {
    embedCopied.value = true
    showMessage('¡Código de inserción copiado!')
    setTimeout(() => {
      embedCopied.value = false
    }, 2000)
  } else {
    showMessage('Error al copiar el código', 'error')
  }
}

const selectLink = () => {
  linkInput.value?.select()
}

const selectEmbed = () => {
  embedInput.value?.select()
}

const shareOnSocial = (platform) => {
  if (!props.design) return
  openSocialShare(platform, props.design)
  showMessage(`Compartiendo en ${platform}...`)
}

const shareNatively = async () => {
  if (!props.design) return
  
  const shareData = {
    title: `Mi diseño de tabla: ${designName.value}`,
    text: '¡Mira mi increíble diseño de tabla personalizada!',
    url: shareableLink.value
  }
  
  const success = await shareNative(shareData)
  if (!success) {
    showMessage('No se pudo compartir nativamente', 'error')
  }
}

const shareViaEmail = () => {
  if (!props.design) return
  shareEmail(props.design)
  showMessage('Abriendo cliente de email...')
}

const downloadImage = () => {
  if (!props.canvasRef) {
    showMessage('No se puede descargar la imagen', 'error')
    return
  }
  
  const success = downloadForSharing(props.canvasRef, designName.value)
  if (success) {
    showMessage('¡Imagen descargada!')
  } else {
    showMessage('Error al descargar la imagen', 'error')
  }
}

const downloadQRCode = () => {
  if (!qrCodeUrl.value) return
  
  const link = document.createElement('a')
  link.download = `qr-${designName.value}.png`
  link.href = qrCodeUrl.value
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  showMessage('¡Código QR descargado!')
}

// Clear messages when modal opens
onMounted(() => {
  clearMessages()
})
</script>

<style scoped>
.share-design-modal {
  /* Custom scrollbar for modal content */
}

.share-design-modal ::-webkit-scrollbar {
  width: 6px;
}

.share-design-modal ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.share-design-modal ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.share-design-modal ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation classes */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}
</style>