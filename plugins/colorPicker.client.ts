import VueColor from '@ckpack/vue-color';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueColor);
});