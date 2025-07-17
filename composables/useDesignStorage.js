import { ref, computed } from 'vue'

export const useDesignStorage = () => {
  const savedDesigns = ref([])
  const currentDesign = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Storage keys
  const STORAGE_KEY = 'einanuxt3-saved-designs'
  const CURRENT_DESIGN_KEY = 'einanuxt3-current-design'
  const AUTO_SAVE_KEY = 'einanuxt3-auto-save'

  // Load saved designs from localStorage
  const loadSavedDesigns = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        savedDesigns.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('Error loading saved designs:', err)
      error.value = 'Failed to load saved designs'
    }
  }

  // Save design to localStorage
  const saveDesign = (canvasData, designName = null) => {
    try {
      isLoading.value = true
      error.value = null

      const design = {
        id: generateDesignId(),
        name: designName || `Design ${savedDesigns.value.length + 1}`,
        canvasData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      }

      // Check if design with same name exists
      const existingIndex = savedDesigns.value.findIndex(d => d.name === design.name)
      
      if (existingIndex >= 0) {
        // Update existing design
        design.version = savedDesigns.value[existingIndex].version + 1
        design.createdAt = savedDesigns.value[existingIndex].createdAt
        savedDesigns.value[existingIndex] = design
      } else {
        // Add new design
        savedDesigns.value.push(design)
      }

      // Keep only last 50 designs to avoid localStorage limits
      if (savedDesigns.value.length > 50) {
        savedDesigns.value = savedDesigns.value.slice(-50)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns.value))
      currentDesign.value = design

      return design
    } catch (err) {
      console.error('Error saving design:', err)
      error.value = 'Failed to save design'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Load design from saved designs
  const loadDesign = (designId) => {
    try {
      isLoading.value = true
      error.value = null

      const design = savedDesigns.value.find(d => d.id === designId)
      if (!design) {
        throw new Error('Design not found')
      }

      currentDesign.value = design
      localStorage.setItem(CURRENT_DESIGN_KEY, JSON.stringify(design))
      
      return design
    } catch (err) {
      console.error('Error loading design:', err)
      error.value = 'Failed to load design'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Delete design
  const deleteDesign = (designId) => {
    try {
      const index = savedDesigns.value.findIndex(d => d.id === designId)
      if (index >= 0) {
        savedDesigns.value.splice(index, 1)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns.value))
        
        // Clear current design if it was deleted
        if (currentDesign.value?.id === designId) {
          currentDesign.value = null
          localStorage.removeItem(CURRENT_DESIGN_KEY)
        }
      }
    } catch (err) {
      console.error('Error deleting design:', err)
      error.value = 'Failed to delete design'
    }
  }

  // Duplicate design
  const duplicateDesign = (designId) => {
    try {
      const originalDesign = savedDesigns.value.find(d => d.id === designId)
      if (!originalDesign) {
        throw new Error('Design not found')
      }

      const duplicatedDesign = {
        ...originalDesign,
        id: generateDesignId(),
        name: `${originalDesign.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      }

      savedDesigns.value.push(duplicatedDesign)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns.value))

      return duplicatedDesign
    } catch (err) {
      console.error('Error duplicating design:', err)
      error.value = 'Failed to duplicate design'
      return null
    }
  }

  // Auto-save current design
  const autoSave = (canvasData) => {
    try {
      const autoSaveData = {
        canvasData,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData))
    } catch (err) {
      console.error('Auto-save failed:', err)
    }
  }

  // Load auto-saved design
  const loadAutoSave = () => {
    try {
      const autoSaveData = localStorage.getItem(AUTO_SAVE_KEY)
      if (autoSaveData) {
        return JSON.parse(autoSaveData)
      }
    } catch (err) {
      console.error('Error loading auto-save:', err)
    }
    return null
  }

  // Clear auto-save
  const clearAutoSave = () => {
    localStorage.removeItem(AUTO_SAVE_KEY)
  }

  // Export design data for sharing
  const exportDesign = (designId) => {
    try {
      const design = savedDesigns.value.find(d => d.id === designId)
      if (!design) {
        throw new Error('Design not found')
      }

      const exportData = {
        version: '1.0',
        design: {
          name: design.name,
          canvasData: design.canvasData,
          createdAt: design.createdAt
        },
        app: 'einanuxt3',
        exportedAt: new Date().toISOString()
      }

      return btoa(JSON.stringify(exportData))
    } catch (err) {
      console.error('Error exporting design:', err)
      error.value = 'Failed to export design'
      return null
    }
  }

  // Import design from export data
  const importDesign = (exportData) => {
    try {
      const data = JSON.parse(atob(exportData))
      
      if (data.app !== 'einanuxt3') {
        throw new Error('Invalid design format')
      }

      const design = {
        id: generateDesignId(),
        name: `${data.design.name} (Imported)`,
        canvasData: data.design.canvasData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      }

      savedDesigns.value.push(design)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns.value))

      return design
    } catch (err) {
      console.error('Error importing design:', err)
      error.value = 'Failed to import design'
      return null
    }
  }

  // Rename design
  const renameDesign = (designId, newName) => {
    try {
      const design = savedDesigns.value.find(d => d.id === designId)
      if (!design) {
        throw new Error('Design not found')
      }

      design.name = newName
      design.updatedAt = new Date().toISOString()
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns.value))
      
      if (currentDesign.value?.id === designId) {
        currentDesign.value = design
      }

      return design
    } catch (err) {
      console.error('Error renaming design:', err)
      error.value = 'Failed to rename design'
      return null
    }
  }

  // Generate unique design ID
  const generateDesignId = () => {
    return `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Computed properties
  const sortedDesigns = computed(() => {
    return [...savedDesigns.value].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  })

  const designCount = computed(() => savedDesigns.value.length)

  const hasAutoSave = computed(() => {
    return !!localStorage.getItem(AUTO_SAVE_KEY)
  })

  // Initialize
  loadSavedDesigns()

  return {
    // State
    savedDesigns: sortedDesigns,
    currentDesign,
    isLoading,
    error,
    designCount,
    hasAutoSave,

    // Actions
    saveDesign,
    loadDesign,
    deleteDesign,
    duplicateDesign,
    renameDesign,
    autoSave,
    loadAutoSave,
    clearAutoSave,
    exportDesign,
    importDesign,
    loadSavedDesigns
  }
}