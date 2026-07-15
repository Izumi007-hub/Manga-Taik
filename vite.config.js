import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ⚠️ IMPORTANTE: cambia "manga-reader" por el nombre EXACTO de tu repositorio
// de GitHub si vas a publicar en https://<usuario>.github.io/<repo>/
// Si publicas en un dominio propio o en <usuario>.github.io (repo raíz), pon base: '/'
const REPO_NAME = 'Manga-Taik'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'],
      manifest: {
        name: 'Manga Reader',
        short_name: 'MangaReader',
        description: 'Lector de manga gratuito usando la API de MangaDex',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: `/${REPO_NAME}/`,
        scope: `/${REPO_NAME}/`,
        icons: [
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/mangataik\.torresizumi1\.workers\.dev\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mangadex-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 }
            }
          },
          {
            urlPattern: /^https:\/\/uploads\.mangadex\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mangadex-images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          }
        ]
      }
    })
  ]
})
