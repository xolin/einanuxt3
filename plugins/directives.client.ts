import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {    
  nuxtApp.vueApp.directive('resize',
  {
  mounted: function(el, binding) {
    const onResizeCallback = binding.value;
    window.addEventListener('resize', () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      onResizeCallback({ width, height });
    })
  }
})
});