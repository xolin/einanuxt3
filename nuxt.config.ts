import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-17',
  devServer: {
    port: 80,
    host: '0.0.0.0',
    https: false,
  },
  modules: ['nuxt-gtag', '@sidebase/nuxt-auth'],
  
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    }
  },
  
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || 'your-secret-key-here',
    public: {
      authUrl: process.env.AUTH_ORIGIN || 'http://localhost:3000'
    }
  },
  
  gtag: { id: 'G-6QYKDDGTZK' },
  pages: true,
  ssr: false,
  app: {
    head: {
      charset: 'utf-8',
      meta: [
        { name: 'viewport', content: 'width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1' }
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
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
})
