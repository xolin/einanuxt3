// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,  
  css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
    },
    // nitro: {
    //   preset: "vercel",
    // },
    // modules: [
    //   'nuxt-headlessui'
    // ]
})
