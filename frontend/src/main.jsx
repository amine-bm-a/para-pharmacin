import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { requestNotificationPermission, isPushSupported } from './utils/pushNotifications.js'

// ── Service Worker registration (handled by vite-plugin-pwa) ─────────────
// vite-plugin-pwa automatically registers /sw.js via the virtual module.
// We import it here to trigger registration in production builds.
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  // Called when a new SW version is waiting to activate
  onNeedRefresh() {
    // Show a toast/banner prompting the user to refresh
    if (window.__pwaUpdateReady) return
    window.__pwaUpdateReady = true

    // Simple non-blocking toast
    const toast = document.createElement('div')
    toast.id = 'pwa-update-toast'
    toast.innerHTML = `
      <div style="
        position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
        background:#1e293b;color:white;padding:.85rem 1.4rem;
        border-radius:14px;z-index:99999;display:flex;align-items:center;
        gap:.75rem;font-family:Inter,sans-serif;font-size:.9rem;
        box-shadow:0 8px 30px rgba(0,0,0,0.25);max-width:90vw;
      ">
        <span>🔄 Mise à jour disponible</span>
        <button id="pwa-update-btn" style="
          background:#16a34a;color:white;border:none;padding:.4rem .9rem;
          border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;
        ">Mettre à jour</button>
        <button id="pwa-dismiss-btn" style="
          background:transparent;color:#94a3b8;border:none;cursor:pointer;
          font-size:1rem;padding:0 .25rem;
        ">✕</button>
      </div>
    `
    document.body.appendChild(toast)
    document.getElementById('pwa-update-btn')?.addEventListener('click', () => {
      updateSW(true)
      toast.remove()
    })
    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => toast.remove())
  },
  onOfflineReady() {
    console.log('[PWA] App ready for offline use.')
  },
})

// ── Request push notification permission on first visit ──────────────────
// Only ask if SW + Push is supported and permission hasn't been decided yet.
if (isPushSupported() && Notification.permission === 'default') {
  // Delay to avoid immediately blocking the user
  setTimeout(() => requestNotificationPermission(), 8000)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
