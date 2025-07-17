<template>
  <div v-if="isVisible" class="preview-modal-overlay">
    <div class="preview-modal">
      <div class="preview-header">
        <h2>Vista Previa 3D</h2>
        <div class="view-controls">
          <button 
            v-for="view in viewOptions" 
            :key="view.id"
            @click="activeView = view.id"
            class="view-btn"
            :class="{ active: activeView === view.id }"
          >
            <span class="material-symbols-sharp">{{ view.icon }}</span>
            <span>{{ view.label }}</span>
          </button>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <span class="material-symbols-sharp">close</span>
        </button>
      </div>

      <div class="preview-content">
        <div class="skateboard-3d-container">
          <div class="skateboard-3d" :class="`view-${activeView}`">
            <div class="skateboard-deck" :style="{ backgroundColor: deckColor }">
              <!-- Preview elements from canvas -->
              <div 
                v-for="element in previewElements" 
                :key="element.id"
                class="preview-element"
                :style="getElementStyle(element)"
              >
                {{ element.content }}
              </div>
            </div>
            <div class="skateboard-shadow"></div>
          </div>
        </div>

        <div class="preview-info">
          <div class="design-stats">
            <h3>Estadísticas del Diseño</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Elementos:</span>
                <span class="stat-value">{{ previewElements.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Color de fondo:</span>
                <div class="color-sample" :style="{ backgroundColor: deckColor }"></div>
              </div>
              <div class="stat-item">
                <span class="stat-label">Resolución:</span>
                <span class="stat-value">{{ resolution.width }}x{{ resolution.height }}px</span>
              </div>
            </div>
          </div>

          <div class="export-options">
            <h3>Opciones de Exportación</h3>
            <div class="quality-section">
              <label>Calidad de exportación:</label>
              <select v-model="exportQuality" class="quality-select">
                <option value="standard">Estándar (72 DPI)</option>
                <option value="high">Alta (150 DPI)</option>
                <option value="print">Impresión (300 DPI)</option>
              </select>
            </div>
            
            <div class="format-section">
              <label>Formato:</label>
              <div class="format-options">
                <button 
                  v-for="format in formatOptions" 
                  :key="format.id"
                  @click="exportFormat = format.id"
                  class="format-btn"
                  :class="{ active: exportFormat === format.id }"
                >
                  {{ format.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-footer">
        <button @click="$emit('close')" class="cancel-btn">
          Cancelar
        </button>
        <button @click="exportDesign" class="export-btn">
          <span class="material-symbols-sharp">download</span>
          Exportar {{ exportFormat.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  deckColor: {
    type: String,
    default: '#026ed9'
  },
  elements: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'export'])

const activeView = ref('top')
const exportQuality = ref('high')
const exportFormat = ref('jpg')

const viewOptions = ref([
  { id: 'top', label: 'Superior', icon: 'expand_less' },
  { id: 'bottom', label: 'Inferior', icon: 'expand_more' },
  { id: 'side', label: 'Lateral', icon: 'keyboard_arrow_right' },
  { id: 'perspective', label: '3D', icon: '3d_rotation' }
])

const formatOptions = ref([
  { id: 'jpg', label: 'JPG' },
  { id: 'png', label: 'PNG' },
  { id: 'svg', label: 'SVG' }
])

const resolution = computed(() => {
  const qualityMap = {
    standard: { width: 1200, height: 800, dpi: 72 },
    high: { width: 1800, height: 1200, dpi: 150 },
    print: { width: 3600, height: 2400, dpi: 300 }
  }
  return qualityMap[exportQuality.value]
})

const previewElements = computed(() => {
  return props.elements.map(element => ({
    ...element,
    // Convert canvas coordinates to preview coordinates
    x: (element.left / 2833) * 100,
    y: (element.top / 10119) * 100
  }))
})

const getElementStyle = (element) => {
  const baseStyle = {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    transform: 'translate(-50%, -50%)',
    fontSize: `${Math.max(8, element.fontSize / 50)}px`,
    color: element.fill || '#000000',
    fontFamily: element.fontFamily || 'Arial',
    fontWeight: element.fontWeight || 'normal'
  }

  // Adjust style based on view
  if (activeView.value === 'perspective') {
    return {
      ...baseStyle,
      transform: 'translate(-50%, -50%) perspective(800px) rotateX(15deg)'
    }
  }

  return baseStyle
}

const exportDesign = () => {
  emit('export', {
    quality: exportQuality.value,
    format: exportFormat.value,
    resolution: resolution.value,
    view: activeView.value
  })
}
</script>

<style scoped>
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.preview-modal {
  background: white;
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.view-btn.active {
  background: rgba(255, 255, 255, 0.4);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.preview-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 300px;
  min-height: 0;
}

.skateboard-3d-container {
  padding: 40px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.skateboard-3d {
  position: relative;
  transition: all 0.3s ease;
}

.view-top .skateboard-deck {
  width: 200px;
  height: 320px;
  border-radius: 100px;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: perspective(800px) rotateX(0deg);
}

.view-bottom .skateboard-deck {
  width: 200px;
  height: 320px;
  border-radius: 100px;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: perspective(800px) rotateY(180deg);
}

.view-side .skateboard-deck {
  width: 320px;
  height: 40px;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: perspective(800px) rotateY(90deg);
}

.view-perspective .skateboard-deck {
  width: 200px;
  height: 320px;
  border-radius: 100px;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transform: perspective(800px) rotateX(15deg) rotateY(-10deg);
}

.skateboard-deck {
  overflow: hidden;
  transition: all 0.3s ease;
}

.preview-element {
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  font-weight: 600;
}

.skateboard-shadow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  filter: blur(8px);
}

.preview-info {
  padding: 24px;
  background: white;
  overflow-y: auto;
}

.design-stats,
.export-options {
  margin-bottom: 24px;
}

.design-stats h3,
.export-options h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.color-sample {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.quality-section,
.format-section {
  margin-bottom: 16px;
}

.quality-section label,
.format-section label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.quality-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.format-options {
  display: flex;
  gap: 8px;
}

.format-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 500;
}

.format-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.format-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #f3f4f6;
  background: #f9fafb;
}

.cancel-btn {
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.export-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .preview-modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .preview-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  
  .skateboard-3d-container {
    padding: 20px;
  }
  
  .view-top .skateboard-deck,
  .view-bottom .skateboard-deck,
  .view-perspective .skateboard-deck {
    width: 150px;
    height: 240px;
  }
  
  .preview-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .cancel-btn,
  .export-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>