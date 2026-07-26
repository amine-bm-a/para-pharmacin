/**
 * Custom Service Worker — Para Ben Moussa PWA
 *
 * Handles:
 *  1. Workbox precaching (injected by vite-plugin-pwa at build time)
 *  2. Runtime caching (API, images, fonts, assets)
 *  3. Offline navigation fallback
 *  4. Web Push notification display
 *  5. Notification click → open/focus the correct page
 */

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { createHandlerBoundToURL } from 'workbox-precaching'

// ── 1. Precaching (manifest injected by vite-plugin-pwa) ─────────────────
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// ── 2. Offline fallback for navigation requests ───────────────────────────
const FALLBACK_URL = '/offline.html'
const allowlist = [/^\/$/]
const denylist  = [/^\/api/, /^\/admin/, /^\/pharmacien/]

// Serve the offline page when navigation fails
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  // Skip admin/api
  const url = new URL(event.request.url)
  if (denylist.some((r) => r.test(url.pathname))) return

  event.respondWith(
    fetch(event.request).catch(() => caches.match(FALLBACK_URL))
  )
})

// ── 3. Runtime caching strategies ────────────────────────────────────────

// API — NetworkFirst (always try fresh, fallback to cache)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 86400 })],
  })
)

// Images — CacheFirst (long-lived assets)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592000 })],
  })
)

// Google Fonts — StaleWhileRevalidate
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 31536000 })],
  })
)

// JS / CSS — StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 604800 })],
  })
)

// ── 4. Push Notifications ─────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return

  let data = {}
  try {
    data = event.data.json()
  } catch {
    data = { title: 'Para Ben Moussa', body: event.data.text() }
  }

  const title = data.title || 'Para Ben Moussa'
  const options = {
    body:    data.body    || '',
    icon:    data.icon    || '/logo-192.png',
    badge:   data.badge   || '/logo-192.png',
    tag:     data.tag     || 'general',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    data: {
      url: data.url || data.data?.url || '/',
    },
    actions: data.actions || [
      { action: 'open',    title: 'Voir' },
      { action: 'dismiss', title: 'Fermer' },
    ],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// ── 5. Notification Click — open/focus correct URL ────────────────────────

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const targetUrl = event.notification.data?.url || '/'
  const fullUrl   = new URL(targetUrl, self.location.origin).href

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing open tab if possible
        for (const client of windowClients) {
          if (client.url === fullUrl && 'focus' in client) {
            return client.focus()
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(fullUrl)
        }
      })
  )
})

// ── 6. SW lifecycle — skip waiting & claim immediately ────────────────────

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})
