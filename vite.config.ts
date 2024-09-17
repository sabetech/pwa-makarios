import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({ 
    registerType: 'autoUpdate', 
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'], sourcemap: true
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Makarios Admin',
        short_name: 'makarios-admin',
        description: 'This is used to track ministerial activities for the makarios dominiation!',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-384x384.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-1.png',
            sizes: '796x1702',
            type: 'image/png'
          },
          {
            src: 'screenshot-2.png',
            sizes: '792x1754',
            type: 'image/png'
          }
        ]
      },
    devOptions: {
      enabled: true
  } })],
})
