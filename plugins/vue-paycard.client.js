import { defineNuxtPlugin } from '#app'
import VuePaycard from "vue-paycard";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePaycard);
});