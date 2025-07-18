/**
 * Touch gestures and haptic feedback utilities
 */
export const useTouchGestures = () => {
  const isGestureEnabled = ref(true)
  const gestureCallbacks = ref({})
  
  // Haptic feedback
  const vibrate = (pattern = 50) => {
    if (process.client && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }
  
  // Light haptic feedback for button taps
  const lightHaptic = () => vibrate(25)
  
  // Medium haptic feedback for actions
  const mediumHaptic = () => vibrate(50)
  
  // Strong haptic feedback for important actions
  const strongHaptic = () => vibrate([100, 50, 100])
  
  // Touch gesture detection
  const setupGestureDetection = (element) => {
    if (!process.client || !element) return
    
    let startX = 0
    let startY = 0
    let startTime = 0
    let isSwipeActive = false
    
    const handleTouchStart = (e) => {
      if (!isGestureEnabled.value) return
      
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
      isSwipeActive = true
    }
    
    const handleTouchMove = (e) => {
      if (!isSwipeActive || !isGestureEnabled.value) return
      
      const touch = e.touches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      
      // Prevent scroll during horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault()
      }
    }
    
    const handleTouchEnd = (e) => {
      if (!isSwipeActive || !isGestureEnabled.value) return
      
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      const deltaTime = Date.now() - startTime
      
      // Minimum swipe distance and maximum time
      const minSwipeDistance = 50
      const maxSwipeTime = 500
      
      if (deltaTime < maxSwipeTime) {
        if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          const direction = deltaX > 0 ? 'right' : 'left'
          triggerGesture('swipe', { direction, deltaX, deltaY })
          lightHaptic()
        } else if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
          // Vertical swipe
          const direction = deltaY > 0 ? 'down' : 'up'
          triggerGesture('swipe', { direction, deltaX, deltaY })
          lightHaptic()
        }
      }
      
      isSwipeActive = false
    }
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }
  
  // Register gesture callback
  const onGesture = (type, callback) => {
    if (!gestureCallbacks.value[type]) {
      gestureCallbacks.value[type] = []
    }
    gestureCallbacks.value[type].push(callback)
  }
  
  // Trigger gesture
  const triggerGesture = (type, data) => {
    if (gestureCallbacks.value[type]) {
      gestureCallbacks.value[type].forEach(callback => callback(data))
    }
  }
  
  // Enable/disable gestures
  const enableGestures = () => {
    isGestureEnabled.value = true
  }
  
  const disableGestures = () => {
    isGestureEnabled.value = false
  }
  
  return {
    isGestureEnabled: readonly(isGestureEnabled),
    vibrate,
    lightHaptic,
    mediumHaptic,
    strongHaptic,
    setupGestureDetection,
    onGesture,
    triggerGesture,
    enableGestures,
    disableGestures
  }
}