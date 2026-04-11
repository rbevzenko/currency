import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',           // we show our own update UI
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico',
        'pwa-icon.svg',
        'apple-touch-icon-180x180.png',
      ],
      manifest: {
        name: 'Currency Converter',
        short_name: 'Currency',
        description: 'Real-time currency converter with 150+ world currencies',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/currency/',
        scope: '/currency/',
        id: '/currency/',
        icons: [
          { src: 'pwa-64x64.png',             sizes: '64x64',   type: 'image/png' },
          { src: 'pwa-192x192.png',            sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',            sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png',  sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Currency Converter',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Cache API calls so the app works offline with last-known rates
        runtimeCaching: [
          {
            // Frankfurter .app and .dev
            urlPattern: /^https:\/\/api\.frankfurter\.(app|dev)\//i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'frankfurter-api',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },  // 1 hr
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // fawazahmed0 CDN fallback
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@fawazahmed0\//i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cdn-currency',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 12 }, // 12 hr
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  base: '/currency/',
})
