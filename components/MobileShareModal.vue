<template>
  <div class="mobile-share-modal" v-if="isVisible" @click="handleBackgroundClick">
    <div class="share-content" @click.stop>
      <!-- Header -->
      <div class="share-header">
        <h2>Compartir Diseño</h2>
        <button class="close-btn" @click="$emit('close')">
          <span class="material-symbols-sharp">close</span>
        </button>
      </div>
      
      <!-- Preview -->
      <div class="design-preview">
        <div class="preview-container">
          <img :src="previewImage" alt="Diseño" class="preview-image" />
          <div class="preview-overlay">
            <button class="preview-btn" @click="togglePreview">
              <span class="material-symbols-sharp">{{ showFullPreview ? 'close' : 'fullscreen' }}</span>
            </button>
          </div>
        </div>
        <p class="preview-caption">{{ designName || 'Mi Diseño' }}</p>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <button 
          class="quick-action-btn download"
          @click="downloadDesign"
          @touchstart="hapticFeedback"
        >
          <span class="action-icon">⬇️</span>
          <span class="action-label">Descargar</span>
        </button>
        
        <button 
          class="quick-action-btn save"
          @click="saveToGallery"
          @touchstart="hapticFeedback"
          v-if="canSaveToGallery"
        >
          <span class="action-icon">💾</span>
          <span class="action-label">Guardar</span>
        </button>
        
        <button 
          class="quick-action-btn copy"
          @click="copyToClipboard"
          @touchstart="hapticFeedback"
          v-if="canCopyToClipboard"
        >
          <span class="action-icon">📋</span>
          <span class="action-label">Copiar</span>
        </button>
      </div>
      
      <!-- Native Share -->
      <div class="native-share" v-if="canUseNativeShare">
        <button 
          class="native-share-btn"
          @click="shareNative"
          @touchstart="hapticFeedback"
        >
          <span class="material-symbols-sharp">share</span>
          <span>Compartir</span>
        </button>
      </div>
      
      <!-- Social Media Options -->
      <div class="social-options" v-if="!canUseNativeShare">
        <h3>Compartir en:</h3>
        <div class="social-buttons">
          <button 
            class="social-btn whatsapp"
            @click="shareToWhatsApp"
            @touchstart="hapticFeedback"
          >
            <span class="social-icon">📱</span>
            <span>WhatsApp</span>
          </button>
          
          <button 
            class="social-btn facebook"
            @click="shareToFacebook"
            @touchstart="hapticFeedback"
          >
            <span class="social-icon">📘</span>
            <span>Facebook</span>
          </button>
          
          <button 
            class="social-btn twitter"
            @click="shareToTwitter"
            @touchstart="hapticFeedback"
          >
            <span class="social-icon">🐦</span>
            <span>Twitter</span>
          </button>
          
          <button 
            class="social-btn instagram"
            @click="shareToInstagram"
            @touchstart="hapticFeedback"
          >
            <span class="social-icon">📷</span>
            <span>Instagram</span>
          </button>
        </div>
      </div>
      
      <!-- Share Link -->
      <div class="share-link">
        <h3>Enlace de compartir:</h3>
        <div class="link-container">
          <input 
            type="text" 
            :value="shareUrl" 
            readonly 
            class="share-url-input"
            ref="urlInput"
          />
          <button 
            class="copy-link-btn"
            @click="copyShareUrl"
            @touchstart="hapticFeedback"
          >
            <span class="material-symbols-sharp">content_copy</span>
          </button>
        </div>
      </div>
      
      <!-- QR Code -->
      <div class="qr-code" v-if="showQRCode">
        <h3>Código QR:</h3>
        <div class="qr-container">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
          <p class="qr-caption">Escanea para ver el diseño</p>
        </div>
      </div>
      
      <!-- Options -->
      <div class="share-options">
        <label class="option-item">
          <input 
            type="checkbox" 
            v-model="includeWatermark"
            class="option-checkbox"
          />
          <span>Incluir marca de agua</span>
        </label>
        
        <label class="option-item">
          <input 
            type="checkbox" 
            v-model="showQRCode"
            class="option-checkbox"
          />
          <span>Mostrar código QR</span>
        </label>
        
        <label class="option-item">
          <input 
            type="checkbox" 
            v-model="highQuality"
            class="option-checkbox"
          />
          <span>Alta calidad</span>
        </label>
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
  designImage: {
    type: String,
    required: true
  },
  designName: {
    type: String,
    default: ''
  },
  designId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'download', 'share', 'save'])

const { lightHaptic, mediumHaptic } = useTouchGestures()

const showFullPreview = ref(false)
const includeWatermark = ref(false)
const showQRCode = ref(false)
const highQuality = ref(false)
const urlInput = ref(null)
const qrCanvas = ref(null)

const previewImage = computed(() => {
  return props.designImage
})

const shareUrl = computed(() => {
  return `${window.location.origin}/design/${props.designId}`
})

const canUseNativeShare = computed(() => {
  return process.client && navigator.share
})

const canSaveToGallery = computed(() => {
  return process.client && 'serviceWorker' in navigator
})

const canCopyToClipboard = computed(() => {
  return process.client && navigator.clipboard
})

const hapticFeedback = () => {
  lightHaptic()
}

const handleBackgroundClick = () => {
  emit('close')
}

const togglePreview = () => {
  showFullPreview.value = !showFullPreview.value
  mediumHaptic()
}

const downloadDesign = async () => {
  try {
    const link = document.createElement('a')
    link.download = `${props.designName || 'diseño'}.png`
    link.href = props.designImage
    link.click()
    
    emit('download', {
      image: props.designImage,
      name: props.designName,
      quality: highQuality.value
    })
    
    mediumHaptic()
  } catch (error) {
    console.error('Error downloading design:', error)
  }
}

const saveToGallery = async () => {
  try {
    // Implementation for saving to device gallery
    const response = await fetch(props.designImage)
    const blob = await response.blob()
    
    if (navigator.share) {
      await navigator.share({
        files: [new File([blob], `${props.designName || 'diseño'}.png`, { type: 'image/png' })],
        title: props.designName || 'Mi Diseño',
        text: 'Mira mi diseño de tabla personalizada'
      })
    }
    
    mediumHaptic()
  } catch (error) {
    console.error('Error saving to gallery:', error)
  }
}

const copyToClipboard = async () => {
  try {
    const response = await fetch(props.designImage)
    const blob = await response.blob()
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])
    
    lightHaptic()
    // Show success message
    showToast('Imagen copiada al portapapeles')
  } catch (error) {
    console.error('Error copying to clipboard:', error)
  }
}

const shareNative = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.designName || 'Mi Diseño',
        text: 'Mira mi diseño de tabla personalizada',
        url: shareUrl.value
      })
      
      mediumHaptic()
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
}

const shareToWhatsApp = () => {
  const message = encodeURIComponent(`Mira mi diseño de tabla personalizada: ${shareUrl.value}`)
  window.open(`https://wa.me/?text=${message}`, '_blank')
  lightHaptic()
}

const shareToFacebook = () => {
  const url = encodeURIComponent(shareUrl.value)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  lightHaptic()
}

const shareToTwitter = () => {
  const text = encodeURIComponent('Mira mi diseño de tabla personalizada')
  const url = encodeURIComponent(shareUrl.value)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  lightHaptic()
}

const shareToInstagram = () => {
  // Instagram doesn't support direct sharing, copy to clipboard instead
  copyShareUrl()
  showToast('Enlace copiado. Pégalo en Instagram Stories')
}

const copyShareUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    lightHaptic()
    showToast('Enlace copiado al portapapeles')
  } catch (error) {
    // Fallback for older browsers
    if (urlInput.value) {
      urlInput.value.select()
      document.execCommand('copy')
      showToast('Enlace copiado al portapapeles')
    }
  }
}

const generateQRCode = async () => {
  if (!qrCanvas.value) return
  
  try {
    // Simple QR code generation (you might want to use a library like qrcode)
    const canvas = qrCanvas.value
    const ctx = canvas.getContext('2d')
    
    // Placeholder QR code (replace with actual QR code generation)
    canvas.width = 150
    canvas.height = 150
    
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 150, 150)
    
    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('QR Code', 75, 75)
    
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const showToast = (message) => {
  // Simple toast notification
  const toast = document.createElement('div')
  toast.className = 'toast-notification'
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 3000)
}

onMounted(() => {
  if (showQRCode.value) {
    generateQRCode()
  }
})
</script>

<style scoped>
.mobile-share-modal {
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

.share-content {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 100%;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.share-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:active {
  transform: scale(0.95);
  background: #e5e7eb;
}

.design-preview {
  padding: 20px;
  text-align: center;
}

.preview-container {
  position: relative;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.preview-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.preview-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.preview-caption {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
}

.quick-action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.quick-action-btn:active {
  transform: scale(0.95);
}

.quick-action-btn.download {
  background: #dbeafe;
  color: #1d4ed8;
}

.quick-action-btn.save {
  background: #dcfce7;
  color: #16a34a;
}

.quick-action-btn.copy {
  background: #fef3c7;
  color: #d97706;
}

.action-icon {
  font-size: 20px;
}

.action-label {
  font-size: 12px;
  font-weight: 500;
}

.native-share {
  padding: 0 20px 20px;
}

.native-share-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.native-share-btn:active {
  transform: translateY(1px);
}

.social-options {
  padding: 0 20px 20px;
}

.social-options h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.social-btn:active {
  transform: scale(0.95);
}

.social-btn.whatsapp {
  background: #dcfce7;
  color: #16a34a;
}

.social-btn.facebook {
  background: #dbeafe;
  color: #1d4ed8;
}

.social-btn.twitter {
  background: #e0f2fe;
  color: #0284c7;
}

.social-btn.instagram {
  background: #fce7f3;
  color: #be185d;
}

.social-icon {
  font-size: 16px;
}

.share-link {
  padding: 0 20px 20px;
}

.share-link h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.link-container {
  display: flex;
  gap: 8px;
}

.share-url-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: #f9fafb;
}

.copy-link-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-link-btn:active {
  background: #f3f4f6;
}

.qr-code {
  padding: 0 20px 20px;
  text-align: center;
}

.qr-code h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-canvas {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.qr-caption {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.share-options {
  padding: 0 20px 20px;
  border-top: 1px solid #e5e7eb;
  margin-top: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.option-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

/* Responsive adjustments */
@media (max-width: 375px) {
  .mobile-share-modal {
    padding: 10px;
  }
  
  .share-content {
    max-height: 95vh;
  }
  
  .preview-image {
    width: 150px;
    height: 150px;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
}
</style>