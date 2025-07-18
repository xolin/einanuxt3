/**
 * Camera integration for mobile devices
 */
export const useCamera = () => {
  const isSupported = ref(false)
  const isActive = ref(false)
  const stream = ref(null)
  const error = ref(null)
  
  // Check camera support
  const checkSupport = () => {
    if (process.client) {
      isSupported.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    }
  }
  
  // Start camera
  const startCamera = async (constraints = { video: { facingMode: 'environment' } }) => {
    if (!isSupported.value) {
      error.value = 'Camera not supported'
      return null
    }
    
    try {
      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      isActive.value = true
      error.value = null
      return stream.value
    } catch (err) {
      error.value = err.message
      isActive.value = false
      return null
    }
  }
  
  // Stop camera
  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    isActive.value = false
  }
  
  // Capture image from camera
  const captureImage = (videoElement) => {
    if (!videoElement || !isActive.value) return null
    
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    
    context.drawImage(videoElement, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }
  
  // Get image from file input or camera
  const getImageFromDevice = () => {
    return new Promise((resolve, reject) => {
      if (process.client) {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        
        // Add camera capture attribute for mobile
        if (isSupported.value) {
          input.setAttribute('capture', 'environment')
        }
        
        input.onchange = (event) => {
          const file = event.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.onerror = (e) => reject(e)
            reader.readAsDataURL(file)
          } else {
            reject(new Error('No file selected'))
          }
        }
        
        input.click()
      } else {
        reject(new Error('Not running in browser'))
      }
    })
  }
  
  // Initialize
  onMounted(() => {
    checkSupport()
  })
  
  // Cleanup
  onUnmounted(() => {
    stopCamera()
  })
  
  return {
    isSupported: readonly(isSupported),
    isActive: readonly(isActive),
    stream: readonly(stream),
    error: readonly(error),
    startCamera,
    stopCamera,
    captureImage,
    getImageFromDevice
  }
}