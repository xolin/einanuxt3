/**
 * Mobile detection and optimization utilities
 */
export const useMobile = () => {
  const isMobile = ref(false)
  const isTouch = ref(false)
  const screenSize = ref('desktop')
  const orientation = ref('portrait')
  
  // Detect mobile device
  const detectMobile = () => {
    if (process.client) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      isMobile.value = mobileRegex.test(userAgent)
      isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      updateScreenSize()
      updateOrientation()
    }
  }
  
  // Update screen size category
  const updateScreenSize = () => {
    if (process.client) {
      const width = window.innerWidth
      if (width < 640) {
        screenSize.value = 'mobile'
      } else if (width < 1024) {
        screenSize.value = 'tablet'
      } else {
        screenSize.value = 'desktop'
      }
    }
  }
  
  // Update orientation
  const updateOrientation = () => {
    if (process.client) {
      orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    }
  }
  
  // Handle resize events
  const handleResize = () => {
    updateScreenSize()
    updateOrientation()
  }
  
  // Initialize on mount
  onMounted(() => {
    detectMobile()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateOrientation, 100)
    })
  })
  
  // Cleanup on unmount
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  })
  
  return {
    isMobile: readonly(isMobile),
    isTouch: readonly(isTouch),
    screenSize: readonly(screenSize),
    orientation: readonly(orientation),
    detectMobile,
    updateScreenSize,
    updateOrientation
  }
}