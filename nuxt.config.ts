import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
import nuxtSanctumAuth from '../dist/module/'

export default defineNuxtConfig({
  devServer: {
    port: 80,
    host: '0.0.0.0',
  },
  modules: ['nuxt-gtag', nuxtSanctumAuth],
  nuxtSanctumAuth: {
    token: true, // set true to use jwt-token auth instead of cookie. default is false
    baseUrl: 'http://api.nuxt.dev',
    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/api/login',
      logout: '/logout',
      user: '/api/user'
    },
    csrf: {
      headerKey: 'X-XSRF-TOKEN',
      cookieKey: 'XSRF-TOKEN',
      tokenCookieKey: 'nuxt-sanctum-auth-token'
    },
    redirects: {
      home: '/lagin',
      login: '/auth/login',
      logout: '/'
    }
  },
  /* 'nuxt-auth-sanctum'],
  sanctum: {
    baseUrl: 'http://api.nuxt.dev/', // Laravel API
    origin: 'http://nuxt.dev/', // Nuxt app, by default will be used 'useRequestURL().origin'
    userStateKey: 'sanctum.user.identity', // user state key for Vue `useState` composable
    redirectIfAuthenticated: false,
    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/api/login',
      logout: '/api/logout',
      user: '/api/user'
    },
    csrf: {
      cookie: 'XSRF-TOKEN', // CSRF cookie name
      header: 'X-XSRF-TOKEN', // CSRF header name
    },
    client: {
        retry: false, // ofetch retry option (number | false)
    },
    redirect: {
        keepRequestedRoute: false, // Keep requested route in the URL for later redirect
        onLogin: '/aa', // Redirect to this page after successful login
        onLogout: '/', // Redirect to this page after successful logout
        onAuthOnly: '/login', // Redirect to this page if user is not authenticated
        onGuestOnly: '/', // Redirect to this page if user is authenticated
    },
  },
  auth: {
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: 'api.nuxt.dev'
      },
    }
  },*/
  
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
