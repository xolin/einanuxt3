// Service Worker for offline functionality
const CACHE_NAME = 'einanuxt3-mobile-v1'
const STATIC_CACHE_NAME = 'einanuxt3-static-v1'
const DYNAMIC_CACHE_NAME = 'einanuxt3-dynamic-v1'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/editor',
  '/offline.html',
  '/manifest.json',
  // Add more static files as needed
]

// API routes that should be cached
const CACHE_API_ROUTES = [
  '/api/designs',
  '/api/templates',
  '/api/fonts'
]

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static files...')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Static files cached successfully')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Error caching static files:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }
  
  // Handle different types of requests
  if (STATIC_FILES.includes(url.pathname)) {
    // Static files - cache first strategy
    event.respondWith(cacheFirst(request))
  } else if (CACHE_API_ROUTES.some(route => url.pathname.startsWith(route))) {
    // API routes - network first strategy
    event.respondWith(networkFirst(request))
  } else if (request.destination === 'image') {
    // Images - cache first strategy
    event.respondWith(cacheFirst(request))
  } else {
    // Everything else - network first strategy
    event.respondWith(networkFirst(request))
  }
})

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // If it's a navigation request, return offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline.html')
    }
    
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-designs') {
    event.waitUntil(syncDesigns())
  }
})

// Sync designs when back online
async function syncDesigns() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const requests = await cache.keys()
    
    // Find pending design saves
    const pendingDesigns = requests.filter(request => 
      request.url.includes('/api/designs') && request.method === 'POST'
    )
    
    for (const request of pendingDesigns) {
      try {
        const response = await fetch(request)
        if (response.ok) {
          await cache.delete(request)
          console.log('Synced design:', request.url)
        }
      } catch (error) {
        console.error('Failed to sync design:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  console.log('Push notification received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver diseños',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/images/xmark.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Custom Decks', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/editor')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Handle messages from main thread
self.addEventListener('message', event => {
  console.log('Message received in SW:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_DESIGN') {
    cacheDesign(event.data.design)
  }
})

// Cache design data
async function cacheDesign(design) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const response = new Response(JSON.stringify(design), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    await cache.put(`/api/designs/${design.id}`, response)
    console.log('Design cached:', design.id)
  } catch (error) {
    console.error('Failed to cache design:', error)
  }
}

// Periodic cleanup of old cache entries
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const requests = await cache.keys()
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader) {
          const responseDate = new Date(dateHeader)
          if (now - responseDate.getTime() > maxAge) {
            await cache.delete(request)
            console.log('Cleaned up old cache entry:', request.url)
          }
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error)
  }
}, 24 * 60 * 60 * 1000) // Run daily