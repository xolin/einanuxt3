<template>
  <div class="tooltip-container relative inline-block">
    <div @mouseenter="showTooltip" @mouseleave="hideTooltip" @focus="showTooltip" @blur="hideTooltip">
      <slot></slot>
    </div>
    
    <!-- Tooltip -->
    <div 
      v-if="isVisible" 
      :class="tooltipClasses"
      class="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-200"
      role="tooltip"
    >
      {{ text }}
      <span v-if="shortcut" class="ml-2 px-1.5 py-0.5 text-xs bg-gray-700 rounded">{{ shortcut }}</span>
      
      <!-- Arrow -->
      <div :class="arrowClasses" class="absolute w-2 h-2 bg-gray-900 transform rotate-45"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  shortcut: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'top',
    validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  delay: {
    type: Number,
    default: 500
  }
})

const isVisible = ref(false)
let timeoutId = null

const showTooltip = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hideTooltip = () => {
  clearTimeout(timeoutId)
  isVisible.value = false
}

const tooltipClasses = computed(() => {
  const base = 'max-w-xs whitespace-nowrap'
  
  switch (props.position) {
    case 'top':
      return `${base} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
    case 'bottom':
      return `${base} top-full left-1/2 transform -translate-x-1/2 mt-2`
    case 'left':
      return `${base} right-full top-1/2 transform -translate-y-1/2 mr-2`
    case 'right':
      return `${base} left-full top-1/2 transform -translate-y-1/2 ml-2`
    default:
      return `${base} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
  }
})

const arrowClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1'
    case 'left':
      return 'left-full top-1/2 transform -translate-y-1/2 -ml-1'
    case 'right':
      return 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
    default:
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
  }
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})
</script>

<style scoped>
.tooltip-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
</style>