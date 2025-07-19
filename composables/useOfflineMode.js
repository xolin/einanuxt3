/**
 * Offline mode and service worker functionality
 */
export const useOfflineMode = () => {
  const isOnline = ref(true)
  const isOfflineEnabled = ref(false)
  const cachedDesigns = ref([])
  const syncQueue = ref([])
  
  // Check online status
  const checkOnlineStatus = () => {
    if (process.client) {
      isOnline.value = navigator.onLine
    }
  }
  
  // Handle online/offline events
  const setupOfflineEvents = () => {
    if (process.client) {
      window.addEventListener('online', () => {
        isOnline.value = true
        syncOfflineData()
      })
      
      window.addEventListener('offline', () => {
        isOnline.value = false
      })
    }
  }
  
  // Register service worker
  const registerServiceWorker = async () => {
    if (process.client && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none' // Ensure SW updates aren't cached
        })
        
        console.log('Service Worker registered:', registration)
        isOfflineEnabled.value = true
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('New service worker found, installing...')
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker installed, will activate on next page load')
                // Optionally show update notification
                showOfflineNotification('Nueva versión disponible. Recarga la página para actualizar.')
              }
            })
          }
        })
        
        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SW_ACTIVATED') {
            console.log('Service worker activated with version:', event.data.version)
          }
        })
        
        // Check for updates periodically (but not too often)
        const updateInterval = setInterval(() => {
          if (document.visibilityState === 'visible') {
            registration.update()
          }
        }, 60000) // Check every minute when page is visible
        
        // Clean up interval on page unload
        window.addEventListener('beforeunload', () => {
          clearInterval(updateInterval)
        })
        
        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }
    return null
  }
  
  // Cache design locally
  const cacheDesign = (design) => {
    const cached = {
      ...design,
      id: design.id || Date.now().toString(),
      timestamp: Date.now(),
      cached: true
    }
    
    cachedDesigns.value.push(cached)
    saveToLocalStorage('cached_designs', cachedDesigns.value)
    
    return cached
  }
  
  // Load cached designs
  const loadCachedDesigns = () => {
    if (process.client) {
      const stored = localStorage.getItem('cached_designs')
      if (stored) {
        cachedDesigns.value = JSON.parse(stored)
      }
    }
  }
  
  // Save to local storage
  const saveToLocalStorage = (key, data) => {
    if (process.client) {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }
  
  // Add to sync queue
  const addToSyncQueue = (action) => {
    syncQueue.value.push({
      ...action,
      timestamp: Date.now()
    })
    saveToLocalStorage('sync_queue', syncQueue.value)
  }
  
  // Sync offline data when online
  const syncOfflineData = async () => {
    if (!isOnline.value || syncQueue.value.length === 0) return
    
    try {
      // Process sync queue
      for (const action of syncQueue.value) {
        // Handle different action types
        switch (action.type) {
          case 'save_design':
            // Sync design save
            break
          case 'share_design':
            // Sync design share
            break
          default:
            break
        }
      }
      
      // Clear sync queue after successful sync
      syncQueue.value = []
      saveToLocalStorage('sync_queue', [])
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
  
  // Check if feature is available offline
  const isFeatureAvailableOffline = (feature) => {
    const offlineFeatures = [
      'design_creation',
      'design_editing',
      'design_saving',
      'design_loading',
      'canvas_manipulation'
    ]
    
    return offlineFeatures.includes(feature)
  }
  
  // Show offline notification
  const showOfflineNotification = (message) => {
    if (process.client) {
      // Create a simple notification
      const notification = document.createElement('div')
      notification.className = 'offline-notification fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = message
      document.body.appendChild(notification)
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
    }
  }
  
  // Initialize
  onMounted(() => {
    checkOnlineStatus()
    setupOfflineEvents()
    loadCachedDesigns()
    
    // Only register service worker in production or when explicitly enabled
    const isDev = process.env.NODE_ENV === 'development'
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname === '0.0.0.0')
    
    // Skip service worker registration in development on localhost to prevent reload loops
    if (!isDev || !isLocalhost) {
      registerServiceWorker()
    } else {
      console.log('Service Worker registration skipped in development on localhost')
    }
    
    // Show offline notification if offline
    if (!isOnline.value) {
      showOfflineNotification('Estás trabajando sin conexión. Los cambios se sincronizarán cuando vuelvas a conectarte.')
    }
  })
  
  return {
    isOnline: readonly(isOnline),
    isOfflineEnabled: readonly(isOfflineEnabled),
    cachedDesigns: readonly(cachedDesigns),
    syncQueue: readonly(syncQueue),
    cacheDesign,
    loadCachedDesigns,
    addToSyncQueue,
    syncOfflineData,
    isFeatureAvailableOffline,
    showOfflineNotification
  }
}