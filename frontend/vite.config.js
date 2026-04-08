import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'pwa-icon-512.png'],
      manifest: {
        name: 'Food Reels',
        short_name: 'FoodReels',
        description: 'Discover, order & enjoy food through immersive video reels',
        theme_color: '#f5a623',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
