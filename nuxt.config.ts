import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-18',
  devServer: {
    port: 80,
    host: '0.0.0.0',
    https: false,
  },
  modules: ['nuxt-gtag'],
  
  gtag: { id: 'G-6QYKDDGTZK' },
  pages: true,
  ssr: false,
  app: {
    head: {
      charset: 'utf-8',
      meta: [
        { name: 'viewport', content: 'width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#667eea' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Custom Decks' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#667eea' },
        { name: 'msapplication-TileImage', content: '/icon-144x144.png' },
        { name: 'application-name', content: 'Custom Decks' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'format-detection', content: 'address=no' },
        { name: 'format-detection', content: 'email=no' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icon-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icon-16x16.png' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#667eea' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },
    server: {
      hmr: {
        port: 24678,
        overlay: false
      }
    },
    optimizeDeps: {
      exclude: ['@pablinho/vue-paycard']
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    esbuild: {
      target: 'esnext'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    preset: 'node-server',
    compatibilityDate: '2025-07-18',
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
})
