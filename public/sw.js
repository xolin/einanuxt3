// Service Worker for offline functionality
const VERSION = '2.0.0'
const CACHE_NAME = `einanuxt3-mobile-v${VERSION}`
const STATIC_CACHE_NAME = `einanuxt3-static-v${VERSION}`
const DYNAMIC_CACHE_NAME = `einanuxt3-dynamic-v${VERSION}`

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

// Files that should never be cached (Nuxt dynamic imports)
const NEVER_CACHE_PATTERNS = [
  /_nuxt\/.*\.js$/,
  /_nuxt\/.*\.mjs$/,
  /_nuxt\/.*\.css$/,
  /\.hot-update\./,
  /\?.*$/,  // Skip files with query parameters
]

// Check if URL should never be cached
function shouldNeverCache(url) {
  return NEVER_CACHE_PATTERNS.some(pattern => pattern.test(url))
}

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker installing version:', VERSION)
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static files...')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Static files cached successfully')
        // Skip waiting to activate immediately on update
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Error caching static files:', error)
      })
  )
})

// Activate event - clean up old caches and handle updates
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete any cache that doesn't match current version
            if (!cacheName.includes(VERSION)) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Claim all clients to ensure immediate control
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activated with version:', VERSION)
      // Send message to all clients about update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: VERSION
          })
        })
      })
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
  
  // Skip files that should never be cached (Nuxt dynamic imports)
  if (shouldNeverCache(url.pathname + url.search)) {
    console.log('Bypassing cache for:', url.href)
    return
  }
  
  // Check for hard refresh (cache bypass)
  if (request.cache === 'reload') {
    console.log('Hard refresh detected, bypassing cache for:', url.href)
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

// Cache first strategy with better validation
async function cacheFirst(request) {
  try {
    // Check if this should never be cached
    if (shouldNeverCache(request.url)) {
      return fetch(request)
    }
    
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

// Network first strategy with better error handling
async function networkFirst(request) {
  try {
    // Always try network first for dynamic content
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200) {
      // Only cache successful responses for non-dynamic content
      if (!shouldNeverCache(request.url)) {
        const cache = await caches.open(DYNAMIC_CACHE_NAME)
        cache.put(request, networkResponse.clone())
      }
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed for:', request.url, error)
    
    // For navigation requests, try cache fallback
    if (request.mode === 'navigate') {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
      
      // Return offline page if available
      return caches.match('/offline.html') || new Response('Offline - Page not available', {
        status: 503,
        statusText: 'Service Unavailable'
      })
    }
    
    // For other requests, try cache fallback
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
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