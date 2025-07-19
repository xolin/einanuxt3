<template>
  <div class="design-manager">
    <!-- Toggle Button -->
    <Tooltip text="Gestionar diseños guardados" shortcut="Ctrl+S" position="left">
      <button
        class="fixed top-1/2 left-0 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-r-lg shadow-lg z-40 transition-colors duration-200"
        :class="{ 'left-80': isOpen }"
        @click="togglePanel"
      >
        <span class="material-symbols-sharp text-xl">
          {{ isOpen ? 'close' : 'save' }}
        </span>
      </button>
    </Tooltip>

    <!-- Panel -->
    <div
      :class="{ 'translate-x-0': isOpen, '-translate-x-full': !isOpen }"
      class="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-30 transform transition-transform duration-300 overflow-y-auto border-r border-gray-200"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Mis Diseños</h2>
          <button 
            class="text-gray-500 hover:text-gray-700 p-1"
            @click="closePanel"
          >
            <span class="material-symbols-sharp">close</span>
          </button>
        </div>

        <!-- Auto-save notification -->
        <div v-if="hasAutoSave" class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div class="flex items-start">
            <span class="material-symbols-sharp text-blue-400 mr-2">info</span>
            <div>
              <p class="text-sm text-blue-700 font-medium">Auto-guardado disponible</p>
              <p class="text-xs text-blue-600 mt-1">Hay cambios sin guardar</p>
              <button 
                class="text-xs text-blue-600 underline hover:text-blue-800 mt-2"
                @click="loadAutoSaveDesign"
              >
                Cargar auto-guardado
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Save Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Guardar Actual</h3>
          <div class="space-y-3">
            <div>
              <input
                v-model="newDesignName"
                type="text"
                placeholder="Nombre del diseño..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @keyup.enter="saveCurrentDesign"
              />
            </div>
            <button
              :disabled="isLoading || !newDesignName.trim()"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center"
              @click="saveCurrentDesign"
            >
              <span v-if="isLoading" class="material-symbols-sharp animate-spin mr-2">refresh</span>
              <span v-else class="material-symbols-sharp mr-2">save</span>
              {{ isLoading ? 'Guardando...' : 'Guardar Diseño' }}
            </button>
          </div>
        </div>

        <!-- Import/Export Section -->
        <div class="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Importar/Exportar</h3>
          <div class="space-y-2">
            <button
              class="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
              @click="showImportDialog = true"
            >
              📥 Importar diseño
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition duration-200"
              @click="showExportDialog = true"
            >
              📤 Exportar diseño actual
            </button>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div class="flex items-center">
            <span class="material-symbols-sharp text-red-500 mr-2">error</span>
            <span class="text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Saved Designs -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-700">
              Diseños Guardados ({{ designCount }})
            </h3>
            <button
              v-if="designCount > 0"
              class="text-xs text-red-600 hover:text-red-800 underline"
              @click="confirmClearAll = true"
            >
              Limpiar todo
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="designCount === 0" class="text-center py-8 text-gray-500">
            <span class="material-symbols-sharp text-4xl mb-2 block">folder_open</span>
            <p class="text-sm">No hay diseños guardados</p>
            <p class="text-xs text-gray-400 mt-1">Guarda tu primer diseño arriba</p>
          </div>

          <!-- Design List -->
          <div v-else class="space-y-3">
            <div
              v-for="design in savedDesigns"
              :key="design.id"
              class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">{{ design.name }}</h4>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatDate(design.updatedAt) }}
                  </p>
                  <p class="text-xs text-gray-400">
                    v{{ design.version }}
                  </p>
                </div>
                <div class="flex items-center space-x-1 ml-2">
                  <Tooltip text="Cargar diseño" position="top">
                    <button
                      class="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      @click="loadSavedDesign(design.id)"
                    >
                      <span class="material-symbols-sharp text-sm">download</span>
                    </button>
                  </Tooltip>
                  <Tooltip text="Duplicar" position="top">
                    <button
                      class="p-1 text-green-600 hover:bg-green-100 rounded"
                      @click="duplicateSavedDesign(design.id)"
                    >
                      <span class="material-symbols-sharp text-sm">content_copy</span>
                    </button>
                  </Tooltip>
                  <Tooltip text="Compartir" position="top">
                    <button
                      class="p-1 text-purple-600 hover:bg-purple-100 rounded"
                      @click="shareDesign(design)"
                    >
                      <span class="material-symbols-sharp text-sm">share</span>
                    </button>
                  </Tooltip>
                  <Tooltip text="Eliminar" position="top">
                    <button
                      class="p-1 text-red-600 hover:bg-red-100 rounded"
                      @click="confirmDelete = design.id"
                    >
                      <span class="material-symbols-sharp text-sm">delete</span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Dialog -->
    <Modal v-if="showImportDialog" @close="showImportDialog = false">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Importar Diseño</h3>
        <p class="text-sm text-gray-600 mb-4">
          Pega el código de diseño compartido para importarlo:
        </p>
        <textarea
          v-model="importCode"
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none"
          placeholder="Pega aquí el código de diseño..."
        ></textarea>
        <div class="flex justify-end space-x-3 mt-4">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="showImportDialog = false"
          >
            Cancelar
          </button>
          <button
            :disabled="!importCode.trim()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
            @click="importDesignFromCode"
          >
            Importar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Export Dialog -->
    <Modal v-if="showExportDialog" @close="showExportDialog = false">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Exportar Diseño</h3>
        <p class="text-sm text-gray-600 mb-4">
          Copia este código para compartir tu diseño:
        </p>
        <textarea
          :value="exportCode"
          readonly
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none bg-gray-50"
          @click="selectExportCode"
        ></textarea>
        <div class="flex justify-end space-x-3 mt-4">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="showExportDialog = false"
          >
            Cerrar
          </button>
          <button
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            @click="copyExportCode"
          >
            Copiar Código
          </button>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation -->
    <Modal v-if="confirmDelete" @close="confirmDelete = null">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
        <p class="text-sm text-gray-600 mb-4">
          ¿Estás seguro de que quieres eliminar este diseño? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="confirmDelete = null"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            @click="deleteDesignConfirmed"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Clear All Confirmation -->
    <Modal v-if="confirmClearAll" @close="confirmClearAll = false">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Limpiar Todos los Diseños</h3>
        <p class="text-sm text-gray-600 mb-4">
          ¿Estás seguro de que quieres eliminar TODOS los diseños guardados? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="confirmClearAll = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            @click="clearAllDesigns"
          >
            Eliminar Todo
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useDesignStorage } from '~/composables/useDesignStorage'
import { useDesignSharing } from '~/composables/useDesignSharing'

const props = defineProps({
  canvasData: Object
})

const emit = defineEmits(['load-design', 'design-saved'])

// Storage composable
const {
  savedDesigns,
  currentDesign,
  isLoading,
  error,
  designCount,
  hasAutoSave,
  saveDesign,
  loadDesign,
  deleteDesign,
  duplicateDesign,
  autoSave,
  loadAutoSave,
  exportDesign,
  importDesign
} = useDesignStorage()

// Sharing composable
const { copyToClipboard } = useDesignSharing()

// Component state
const isOpen = ref(false)
const newDesignName = ref('')
const showImportDialog = ref(false)
const showExportDialog = ref(false)
const importCode = ref('')
const exportCode = ref('')
const confirmDelete = ref(null)
const confirmClearAll = ref(false)

// Methods
const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}

const saveCurrentDesign = async () => {
  if (!props.canvasData || !newDesignName.value.trim()) return
  
  const saved = await saveDesign(props.canvasData, newDesignName.value.trim())
  if (saved) {
    newDesignName.value = ''
    emit('design-saved', saved)
  }
}

const loadSavedDesign = async (designId) => {
  const design = await loadDesign(designId)
  if (design) {
    emit('load-design', design.canvasData)
    closePanel()
  }
}

const loadAutoSaveDesign = () => {
  const autoSaveData = loadAutoSave()
  if (autoSaveData) {
    emit('load-design', autoSaveData.canvasData)
  }
}

const duplicateSavedDesign = async (designId) => {
  await duplicateDesign(designId)
}

const deleteDesignConfirmed = async () => {
  if (confirmDelete.value) {
    await deleteDesign(confirmDelete.value)
    confirmDelete.value = null
  }
}

const clearAllDesigns = () => {
  localStorage.removeItem('einanuxt3-saved-designs')
  savedDesigns.value.splice(0)
  confirmClearAll.value = false
}

const shareDesign = (design) => {
  // Emit event to parent to handle sharing
  emit('share-design', design)
}

const importDesignFromCode = async () => {
  if (!importCode.value.trim()) return
  
  const imported = await importDesign(importCode.value.trim())
  if (imported) {
    importCode.value = ''
    showImportDialog.value = false
  }
}

const generateExportCode = () => {
  if (!props.canvasData) return ''
  
  const designData = {
    version: '1.0',
    design: {
      name: newDesignName.value || 'Exported Design',
      canvasData: props.canvasData,
      createdAt: new Date().toISOString()
    },
    app: 'einanuxt3',
    exportedAt: new Date().toISOString()
  }
  
  return btoa(JSON.stringify(designData))
}

const selectExportCode = (event) => {
  event.target.select()
}

const copyExportCode = async () => {
  const success = await copyToClipboard(exportCode.value)
  if (success) {
    showExportDialog.value = false
  }
}

// Watch for export dialog
const openExportDialog = () => {
  exportCode.value = generateExportCode()
  showExportDialog.value = true
}

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Hoy'
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`
  } else {
    return date.toLocaleDateString()
  }
}

// Replace method reference
const openExportDialogMethod = () => {
  exportCode.value = generateExportCode()
  showExportDialog.value = true
}

// Update the button click handler
const handleExportClick = () => {
  openExportDialogMethod()
}

// Replace the export button click
const updateExportDialog = () => {
  showExportDialog.value = true
  exportCode.value = generateExportCode()
}

// Auto-save functionality
const setupAutoSave = () => {
  if (props.canvasData) {
    autoSave(props.canvasData)
  }
}

// Expose methods for parent component
defineExpose({
  togglePanel,
  setupAutoSave
})
</script>

<style scoped>
.design-manager {
  /* Custom scrollbar for webkit browsers */
}

.design-manager ::-webkit-scrollbar {
  width: 6px;
}

.design-manager ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.design-manager ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.design-manager ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>