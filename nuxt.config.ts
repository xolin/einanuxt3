import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],
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
  // plugins: [{ src: "~/plugins/vue-paycard.js", mode: "client" }],
  css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
    },
    nitro: {
      preset: 'node-server',
    },
    //modules: [
      //'@vueuse/nuxt',
    //]
})
