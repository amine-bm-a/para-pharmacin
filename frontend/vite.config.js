import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // injectManifest → we write our own SW (src/sw.js),
      // vite-plugin-pwa injects the precache manifest into it at build time.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',

      registerType: 'prompt', // We show our own update toast in main.jsx
      injectRegister: null,   // We call registerSW() manually in main.jsx

      includeAssets: ['favicon.ico', 'robots.txt', 'logo-192.png', 'logo-512.png', 'offline.html'],

      manifest: {
        name: 'Para Ben Moussa — Parapharmacie',
        short_name: 'Para Ben Moussa',
        description: 'Votre parapharmacie en ligne à Beni Mellal. Commandez vos produits de beauté, santé et bien-être.',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/?utm_source=pwa',
        lang: 'fr',
        categories: ['health', 'shopping', 'medical'],
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Produits',
            short_name: 'Produits',
            description: 'Parcourir tous les produits',
            url: '/products',
            icons: [{ src: '/logo-192.png', sizes: '192x192' }],
          },
          {
            name: 'Mon compte',
            short_name: 'Compte',
            description: 'Accéder à votre compte',
            url: '/mon-compte',
            icons: [{ src: '/logo-192.png', sizes: '192x192' }],
          },
          {
            name: 'Mon panier',
            short_name: 'Panier',
            description: 'Voir votre panier',
            url: '/cart',
            icons: [{ src: '/logo-192.png', sizes: '192x192' }],
          },
        ],
      },

      // injectManifest options (Workbox)
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },

      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  server: {
    port: 3000,
  },
})
