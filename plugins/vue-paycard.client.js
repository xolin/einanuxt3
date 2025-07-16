import { defineNuxtPlugin } from '#app'
import VuePaycard from "@pablinho/vue-paycard";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePaycard);
});