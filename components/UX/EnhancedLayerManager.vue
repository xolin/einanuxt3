<template>
  <div class="enhanced-layer-manager">
    <!-- Toggle Button -->
    <Tooltip text="Gestionar capas" shortcut="L" position="right">
      <button
        class="fixed top-1/2 right-0 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-l-lg shadow-lg z-40 transition-colors duration-200"
        :class="{ 'right-80': isOpen }"
        @click="togglePanel"
      >
        <span class="material-symbols-sharp text-xl">
          {{ isOpen ? 'close' : 'layers' }}
        </span>
        <span v-if="layers.length > 0" class="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {{ layers.length }}
        </span>
      </button>
    </Tooltip>

    <!-- Panel -->
    <div
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
      class="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-30 transform transition-transform duration-300 overflow-y-auto border-l border-gray-200"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Capas</h2>
          <button 
            class="text-gray-500 hover:text-gray-700 p-1"
            @click="closePanel"
          >
            <span class="material-symbols-sharp">close</span>
          </button>
        </div>

        <!-- Layer Controls -->
        <div class="mb-6 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-700">Controles de Capas</h3>
            <div class="flex space-x-2">
              <Tooltip text="Mostrar todas" position="top">
                <button
                  class="p-1 text-green-600 hover:bg-green-100 rounded"
                  @click="showAllLayers"
                >
                  <span class="material-symbols-sharp text-sm">visibility</span>
                </button>
              </Tooltip>
              <Tooltip text="Ocultar todas" position="top">
                <button
                  class="p-1 text-orange-600 hover:bg-orange-100 rounded"
                  @click="hideAllLayers"
                >
                  <span class="material-symbols-sharp text-sm">visibility_off</span>
                </button>
              </Tooltip>
              <Tooltip text="Eliminar capas ocultas" position="top">
                <button
                  class="p-1 text-red-600 hover:bg-red-100 rounded"
                  @click="deleteHiddenLayers"
                >
                  <span class="material-symbols-sharp text-sm">delete_sweep</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <!-- Layer Search -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar capas..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <span class="absolute left-3 top-2.5 material-symbols-sharp text-gray-400 text-sm">search</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredLayers.length === 0 && layers.length === 0" class="text-center py-8 text-gray-500">
          <span class="material-symbols-sharp text-4xl mb-2 block">layers_clear</span>
          <p class="text-sm">No hay capas</p>
          <p class="text-xs text-gray-400 mt-1">Agrega elementos al canvas para ver capas</p>
        </div>

        <!-- No Search Results -->
        <div v-else-if="filteredLayers.length === 0" class="text-center py-8 text-gray-500">
          <span class="material-symbols-sharp text-4xl mb-2 block">search_off</span>
          <p class="text-sm">No se encontraron capas</p>
          <p class="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda</p>
        </div>

        <!-- Layer List -->
        <div v-else class="space-y-2">
          <div class="text-xs text-gray-500 mb-2">
            {{ filteredLayers.length }} de {{ layers.length }} capas
          </div>
          
          <draggable
            v-model="filteredLayers"
            group="layers"
            item-key="id"
            class="space-y-2"
            @start="onDragStart"
            @end="onDragEnd"
          >
            <template #item="{ element: layer }">
              <div
                :class="[
                  'layer-item',
                  {
                    'layer-selected': selectedLayer === layer.id,
                    'layer-hidden': layer.opacity === 0,
                    'layer-dragging': isDragging
                  }
                ]"
                @click="selectLayer(layer.id)"
                @dblclick="startRenaming(layer.id)"
              >
                <!-- Drag Handle -->
                <div class="drag-handle">
                  <span class="material-symbols-sharp text-gray-400 text-sm">drag_indicator</span>
                </div>

                <!-- Layer Content -->
                <div class="layer-content">
                  <!-- Layer Icon and Name -->
                  <div class="flex items-center space-x-2 flex-1 min-w-0">
                    <span class="layer-icon">{{ getLayerIcon(layer.type) }}</span>
                    
                    <!-- Editable Name -->
                    <div v-if="editingLayer === layer.id" class="flex-1">
                      <input
                        ref="nameInput"
                        v-model="editingName"
                        class="w-full px-2 py-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        @blur="finishRenaming"
                        @keyup.enter="finishRenaming"
                        @keyup.escape="cancelRenaming"
                        @click.stop
                      />
                    </div>
                    
                    <!-- Display Name -->
                    <div v-else class="flex-1 min-w-0">
                      <p class="font-medium text-sm text-gray-900 truncate">
                        {{ layer.name || getDefaultLayerName(layer) }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ layer.type }} • z: {{ layer.zIndex || 0 }}
                      </p>
                    </div>
                  </div>

                  <!-- Layer Actions -->
                  <div class="layer-actions flex items-center space-x-1">
                    <!-- Visibility Toggle -->
                    <Tooltip :text="layer.opacity > 0 ? 'Ocultar' : 'Mostrar'" position="top">
                      <button
                        :class="[
                          'action-btn',
                          layer.opacity > 0 ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                        ]"
                        @click.stop="toggleLayerVisibility(layer.id)"
                      >
                        <span class="material-symbols-sharp text-sm">
                          {{ layer.opacity > 0 ? 'visibility' : 'visibility_off' }}
                        </span>
                      </button>
                    </Tooltip>

                    <!-- Lock Toggle -->
                    <Tooltip :text="layer.locked ? 'Desbloquear' : 'Bloquear'" position="top">
                      <button
                        :class="[
                          'action-btn',
                          layer.locked ? 'text-orange-600 hover:bg-orange-100' : 'text-gray-400 hover:bg-gray-100'
                        ]"
                        @click.stop="toggleLayerLock(layer.id)"
                      >
                        <span class="material-symbols-sharp text-sm">
                          {{ layer.locked ? 'lock' : 'lock_open' }}
                        </span>
                      </button>
                    </Tooltip>

                    <!-- Duplicate -->
                    <Tooltip text="Duplicar" position="top">
                      <button
                        class="action-btn text-blue-600 hover:bg-blue-100"
                        @click.stop="duplicateLayer(layer.id)"
                      >
                        <span class="material-symbols-sharp text-sm">content_copy</span>
                      </button>
                    </Tooltip>

                    <!-- Delete -->
                    <Tooltip text="Eliminar" position="top">
                      <button
                        class="action-btn text-red-600 hover:bg-red-100"
                        @click.stop="deleteLayer(layer.id)"
                      >
                        <span class="material-symbols-sharp text-sm">delete</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <!-- Layer Properties (when selected) -->
                <div v-if="selectedLayer === layer.id && showProperties" class="layer-properties">
                  <div class="mt-3 pt-3 border-t border-gray-200">
                    <h4 class="text-xs font-semibold text-gray-700 mb-2">Propiedades</h4>
                    
                    <!-- Opacity Slider -->
                    <div class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">
                        Opacidad: {{ Math.round((layer.opacity || 1) * 100) }}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        :value="layer.opacity || 1"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        @input="updateLayerOpacity(layer.id, $event.target.value)"
                      />
                    </div>

                    <!-- Position (if available) -->
                    <div v-if="layer.left !== undefined && layer.top !== undefined" class="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label class="text-gray-600 block">X:</label>
                        <span class="text-gray-900">{{ Math.round(layer.left) }}px</span>
                      </div>
                      <div>
                        <label class="text-gray-600 block">Y:</label>
                        <span class="text-gray-900">{{ Math.round(layer.top) }}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Layer Statistics -->
        <div v-if="layers.length > 0" class="mt-6 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Estadísticas</h4>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-gray-600">Total:</span>
              <span class="font-medium text-gray-900 ml-1">{{ layers.length }}</span>
            </div>
            <div>
              <span class="text-gray-600">Visibles:</span>
              <span class="font-medium text-green-600 ml-1">{{ visibleLayerCount }}</span>
            </div>
            <div>
              <span class="text-gray-600">Ocultas:</span>
              <span class="font-medium text-orange-600 ml-1">{{ hiddenLayerCount }}</span>
            </div>
            <div>
              <span class="text-gray-600">Bloqueadas:</span>
              <span class="font-medium text-red-600 ml-1">{{ lockedLayerCount }}</span>
            </div>
          </div>
        </div>

        <!-- Toggle Properties Panel -->
        <div v-if="layers.length > 0" class="mt-4">
          <button
            class="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200"
            @click="showProperties = !showProperties"
          >
            {{ showProperties ? '🔼' : '🔽' }} {{ showProperties ? 'Ocultar' : 'Mostrar' }} propiedades
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  layers: {
    type: Array,
    default: () => []
  },
  selectedLayer: String
})

const emit = defineEmits([
  'select-layer',
  'toggle-visibility',
  'toggle-lock',
  'delete-layer',
  'duplicate-layer',
  'reorder-layers',
  'update-layer-opacity',
  'rename-layer'
])

// Component state
const isOpen = ref(false)
const searchQuery = ref('')
const editingLayer = ref(null)
const editingName = ref('')
const isDragging = ref(false)
const showProperties = ref(false)
const nameInput = ref(null)

// Computed properties
const filteredLayers = computed(() => {
  if (!searchQuery.value) return props.layers

  const query = searchQuery.value.toLowerCase()
  return props.layers.filter(layer => {
    const name = layer.name || getDefaultLayerName(layer)
    return name.toLowerCase().includes(query) || 
           layer.type.toLowerCase().includes(query)
  })
})

const visibleLayerCount = computed(() => 
  props.layers.filter(layer => layer.opacity > 0).length
)

const hiddenLayerCount = computed(() => 
  props.layers.filter(layer => layer.opacity === 0).length
)

const lockedLayerCount = computed(() => 
  props.layers.filter(layer => layer.locked).length
)

// Methods
const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}

const selectLayer = (layerId) => {
  emit('select-layer', layerId)
}

const toggleLayerVisibility = (layerId) => {
  emit('toggle-visibility', layerId)
}

const toggleLayerLock = (layerId) => {
  emit('toggle-lock', layerId)
}

const deleteLayer = (layerId) => {
  emit('delete-layer', layerId)
}

const duplicateLayer = (layerId) => {
  emit('duplicate-layer', layerId)
}

const updateLayerOpacity = (layerId, opacity) => {
  emit('update-layer-opacity', { layerId, opacity: parseFloat(opacity) })
}

const showAllLayers = () => {
  props.layers.forEach(layer => {
    if (layer.opacity === 0) {
      emit('toggle-visibility', layer.id)
    }
  })
}

const hideAllLayers = () => {
  props.layers.forEach(layer => {
    if (layer.opacity > 0) {
      emit('toggle-visibility', layer.id)
    }
  })
}

const deleteHiddenLayers = () => {
  const hiddenLayers = props.layers.filter(layer => layer.opacity === 0)
  hiddenLayers.forEach(layer => {
    emit('delete-layer', layer.id)
  })
}

const startRenaming = (layerId) => {
  const layer = props.layers.find(l => l.id === layerId)
  if (layer) {
    editingLayer.value = layerId
    editingName.value = layer.name || getDefaultLayerName(layer)
    nextTick(() => {
      nameInput.value?.focus()
      nameInput.value?.select()
    })
  }
}

const finishRenaming = () => {
  if (editingLayer.value && editingName.value.trim()) {
    emit('rename-layer', {
      layerId: editingLayer.value,
      name: editingName.value.trim()
    })
  }
  editingLayer.value = null
  editingName.value = ''
}

const cancelRenaming = () => {
  editingLayer.value = null
  editingName.value = ''
}

const onDragStart = () => {
  isDragging.value = true
}

const onDragEnd = (event) => {
  isDragging.value = false
  if (event.newIndex !== event.oldIndex) {
    emit('reorder-layers', {
      from: event.oldIndex,
      to: event.newIndex
    })
  }
}

const getLayerIcon = (type) => {
  const icons = {
    text: '📝',
    image: '🖼️',
    emoji: '😊',
    shape: '⬜',
    group: '📁',
    background: '🎨'
  }
  return icons[type] || '⚪'
}

const getDefaultLayerName = (layer) => {
  const names = {
    text: 'Texto',
    image: 'Imagen',
    emoji: 'Emoji',
    shape: 'Forma',
    group: 'Grupo',
    background: 'Fondo'
  }
  return names[layer.type] || 'Capa'
}

// Watch for auto-open on layer changes
watch(() => props.layers.length, (newCount, oldCount) => {
  if (newCount > oldCount && newCount === 1) {
    // Auto-open when first layer is added
    isOpen.value = true
  }
})

// Expose methods for parent component
defineExpose({
  togglePanel,
  isOpen
})
</script>

<style scoped>
.layer-item {
  @apply bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-transparent;
}

.layer-item.layer-selected {
  @apply bg-purple-50 border-purple-200;
}

.layer-item.layer-hidden {
  @apply opacity-60;
}

.layer-item.layer-dragging {
  @apply shadow-lg scale-105;
}

.layer-content {
  @apply flex items-center justify-between;
}

.drag-handle {
  @apply cursor-move mr-2 opacity-30 hover:opacity-60 transition-opacity;
}

.layer-icon {
  @apply text-lg flex-shrink-0;
}

.layer-actions {
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
}

.layer-item:hover .layer-actions {
  @apply opacity-100;
}

.action-btn {
  @apply p-1 rounded transition-colors duration-150;
}

.layer-properties {
  @apply w-full;
}

/* Custom scrollbar */
.enhanced-layer-manager ::-webkit-scrollbar {
  width: 6px;
}

.enhanced-layer-manager ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.enhanced-layer-manager ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.enhanced-layer-manager ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Drag and drop styles */
.sortable-ghost {
  @apply opacity-50;
}

.sortable-chosen {
  @apply transform scale-105 shadow-lg;
}
</style>