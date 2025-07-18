<template>
  <div v-if="isVisible" class="template-gallery-overlay">
    <div class="template-gallery-modal">
      <div class="gallery-header">
        <div class="header-content">
          <h2>Plantillas de Diseño</h2>
          <p>Comienza con una plantilla pre-diseñada y personalízala a tu gusto</p>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <span class="material-symbols-sharp">close</span>
        </button>
      </div>

      <div class="gallery-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="activeCategory = category.id"
          class="category-tab"
          :class="{ active: activeCategory === category.id }"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>

      <div class="gallery-content">
        <div class="templates-grid">
          <div 
            v-for="template in filteredTemplates" 
            :key="template.id"
            @click="selectTemplate(template)"
            class="template-card"
            :class="{ selected: selectedTemplate?.id === template.id }"
          >
            <div class="template-preview">
              <div class="skateboard-preview" :style="{ '--deck-color': template.deckColor }">
                <div 
                  v-for="element in template.elements" 
                  :key="element.id"
                  class="preview-element"
                  :style="getElementStyle(element)"
                >
                  {{ element.content }}
                </div>
              </div>
            </div>
            <div class="template-info">
              <h3 class="template-name">{{ template.name }}</h3>
              <p class="template-description">{{ template.description }}</p>
              <div class="template-tags">
                <span 
                  v-for="tag in template.tags" 
                  :key="tag"
                  class="template-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="gallery-footer">
        <button @click="$emit('close')" class="cancel-btn">
          Cancelar
        </button>
        <button 
          @click="useTemplate" 
          :disabled="!selectedTemplate"
          class="use-template-btn"
        >
          <span class="material-symbols-sharp">add_circle</span>
          Usar Plantilla
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
  }
})

const emit = defineEmits(['close', 'select-template'])

const activeCategory = ref('popular')
const selectedTemplate = ref(null)

const categories = ref([
  { id: 'popular', name: 'Popular', icon: '🔥' },
  { id: 'minimal', name: 'Minimalista', icon: '✨' },
  { id: 'artistic', name: 'Artístico', icon: '🎨' },
  { id: 'sports', name: 'Deportivo', icon: '⚽' },
  { id: 'nature', name: 'Naturaleza', icon: '🌿' },
  { id: 'urban', name: 'Urbano', icon: '🏙️' }
])

const templates = ref([
  // Popular Templates
  {
    id: 'pop-1',
    name: 'Fuego Urbano',
    description: 'Diseño dinámico con elementos urbanos',
    category: 'popular',
    deckColor: '#1a1a1a',
    elements: [
      { id: 'text-1', type: 'text', content: 'FIRE', x: 50, y: 30, color: '#ff6b35', size: 24 },
      { id: 'emoji-1', type: 'emoji', content: '🔥', x: 20, y: 60, size: 20 }
    ],
    tags: ['moderno', 'urbano', 'llamativo']
  },
  {
    id: 'pop-2',
    name: 'Skate Classic',
    description: 'Estilo clásico del skateboarding',
    category: 'popular',
    deckColor: '#2563eb',
    elements: [
      { id: 'text-1', type: 'text', content: 'SKATE', x: 50, y: 40, color: '#ffffff', size: 20 },
      { id: 'emoji-1', type: 'emoji', content: '🛹', x: 50, y: 65, size: 16 }
    ],
    tags: ['clásico', 'skateboard', 'azul']
  },
  
  // Minimal Templates
  {
    id: 'min-1',
    name: 'Simplicidad',
    description: 'Diseño limpio y minimalista',
    category: 'minimal',
    deckColor: '#f8fafc',
    elements: [
      { id: 'text-1', type: 'text', content: 'simple', x: 50, y: 50, color: '#1f2937', size: 18 }
    ],
    tags: ['limpio', 'simple', 'elegante']
  },
  {
    id: 'min-2',
    name: 'Líneas',
    description: 'Geometría simple con líneas',
    category: 'minimal',
    deckColor: '#ffffff',
    elements: [
      { id: 'text-1', type: 'text', content: '———', x: 50, y: 35, color: '#6b7280', size: 16 },
      { id: 'text-2', type: 'text', content: 'minimal', x: 50, y: 50, color: '#111827', size: 14 },
      { id: 'text-3', type: 'text', content: '———', x: 50, y: 65, color: '#6b7280', size: 16 }
    ],
    tags: ['líneas', 'geométrico', 'blanco']
  },

  // Artistic Templates
  {
    id: 'art-1',
    name: 'Arcoíris',
    description: 'Colores vibrantes y artísticos',
    category: 'artistic',
    deckColor: '#7c3aed',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '🌈', x: 50, y: 30, size: 24 },
      { id: 'text-1', type: 'text', content: 'COLOR', x: 50, y: 60, color: '#fbbf24', size: 18 }
    ],
    tags: ['colorido', 'arcoíris', 'vibrante']
  },
  {
    id: 'art-2',
    name: 'Galaxia',
    description: 'Tema espacial y cósmico',
    category: 'artistic',
    deckColor: '#1e1b4b',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '🌌', x: 30, y: 25, size: 20 },
      { id: 'emoji-2', type: 'emoji', content: '⭐', x: 70, y: 35, size: 16 },
      { id: 'text-1', type: 'text', content: 'GALAXY', x: 50, y: 65, color: '#a78bfa', size: 16 }
    ],
    tags: ['espacio', 'estrellas', 'misterioso']
  },

  // Sports Templates
  {
    id: 'sport-1',
    name: 'Fútbol Pro',
    description: 'Para los amantes del fútbol',
    category: 'sports',
    deckColor: '#16a34a',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '⚽', x: 50, y: 35, size: 24 },
      { id: 'text-1', type: 'text', content: 'GOAL!', x: 50, y: 60, color: '#ffffff', size: 20 }
    ],
    tags: ['fútbol', 'deporte', 'verde']
  },
  {
    id: 'sport-2',
    name: 'Extremo',
    description: 'Para deportes extremos',
    category: 'sports',
    deckColor: '#dc2626',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '🏂', x: 30, y: 30, size: 20 },
      { id: 'text-1', type: 'text', content: 'EXTREME', x: 50, y: 55, color: '#ffffff', size: 16 },
      { id: 'emoji-2', type: 'emoji', content: '⚡', x: 70, y: 70, size: 18 }
    ],
    tags: ['extremo', 'adrenalina', 'rojo']
  },

  // Nature Templates
  {
    id: 'nat-1',
    name: 'Bosque',
    description: 'Inspirado en la naturaleza',
    category: 'nature',
    deckColor: '#166534',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '🌲', x: 30, y: 30, size: 20 },
      { id: 'emoji-2', type: 'emoji', content: '🍃', x: 70, y: 40, size: 18 },
      { id: 'text-1', type: 'text', content: 'WILD', x: 50, y: 65, color: '#bbf7d0', size: 18 }
    ],
    tags: ['bosque', 'verde', 'natural']
  },
  {
    id: 'nat-2',
    name: 'Océano',
    description: 'Tema marino y oceánico',
    category: 'nature',
    deckColor: '#0ea5e9',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '🌊', x: 50, y: 30, size: 22 },
      { id: 'emoji-2', type: 'emoji', content: '🐠', x: 70, y: 55, size: 16 },
      { id: 'text-1', type: 'text', content: 'OCEAN', x: 50, y: 70, color: '#ffffff', size: 16 }
    ],
    tags: ['océano', 'azul', 'marino']
  },

  // Urban Templates
  {
    id: 'urb-1',
    name: 'Street Style',
    description: 'Estilo urbano callejero',
    category: 'urban',
    deckColor: '#374151',
    elements: [
      { id: 'emoji-1', type: 'emoji', content: '🏢', x: 25, y: 25, size: 18 },
      { id: 'text-1', type: 'text', content: 'STREET', x: 50, y: 50, color: '#fbbf24', size: 18 },
      { id: 'emoji-2', type: 'emoji', content: '🚗', x: 75, y: 70, size: 16 }
    ],
    tags: ['urbano', 'street', 'ciudad']
  },
  {
    id: 'urb-2',
    name: 'Neon City',
    description: 'Luces de neón urbanas',
    category: 'urban',
    deckColor: '#1f2937',
    elements: [
      { id: 'text-1', type: 'text', content: 'NEON', x: 50, y: 40, color: '#06ffa5', size: 20 },
      { id: 'emoji-1', type: 'emoji', content: '💡', x: 30, y: 60, size: 16 },
      { id: 'emoji-2', type: 'emoji', content: '🌃', x: 70, y: 60, size: 16 }
    ],
    tags: ['neón', 'nocturno', 'futurista']
  }
])

const filteredTemplates = computed(() => {
  return templates.value.filter(template => 
    activeCategory.value === 'popular' ? 
      template.category === 'popular' : 
      template.category === activeCategory.value
  )
})

const selectTemplate = (template) => {
  selectedTemplate.value = template
}

const useTemplate = () => {
  if (selectedTemplate.value) {
    emit('select-template', selectedTemplate.value)
  }
}

const getElementStyle = (element) => {
  return {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    transform: 'translate(-50%, -50%)',
    color: element.color,
    fontSize: `${element.size}px`,
    fontWeight: element.type === 'text' ? '600' : 'normal',
    lineHeight: 1,
    textAlign: 'center'
  }
}

// Reset selection when category changes
watch(activeCategory, () => {
  selectedTemplate.value = null
})
</script>

<style scoped>
.template-gallery-overlay {
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

.template-gallery-modal {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}

.header-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
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

.gallery-tabs {
  display: flex;
  overflow-x: auto;
  padding: 20px 24px 0;
  gap: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  white-space: nowrap;
}

.category-tab:hover {
  background: #f8fafc;
}

.category-tab.active {
  background: #eff6ff;
  color: #3b82f6;
}

.category-icon {
  font-size: 20px;
}

.category-name {
  font-size: 12px;
  font-weight: 500;
}

.gallery-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.template-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.15);
}

.template-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.template-preview {
  padding: 20px;
  background: #f8fafc;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skateboard-preview {
  width: 60px;
  height: 120px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  
  /* Popsicle skateboard shape - more realistic curved shape */
  background: var(--deck-color, #333);
  border-radius: 25px 25px 15px 15px;
  
  /* Create the authentic popsicle shape with CSS clip-path */
  clip-path: polygon(
    25% 0%,     /* top left curve start */
    75% 0%,     /* top right curve start */
    90% 5%,     /* top right curve */
    95% 12%,    /* nose right edge */
    95% 35%,    /* transition to middle */
    88% 45%,    /* right side curve inward */
    88% 55%,    /* right side curve outward */
    95% 65%,    /* transition to tail */
    95% 88%,    /* tail right edge */
    85% 95%,    /* tail right curve */
    75% 98%,    /* tail bottom right */
    60% 100%,   /* tail bottom center-right */
    40% 100%,   /* tail bottom center-left */
    25% 98%,    /* tail bottom left */
    15% 95%,    /* tail left curve */
    5% 88%,     /* tail left edge */
    5% 65%,     /* transition to middle */
    12% 55%,    /* left side curve outward */
    12% 45%,    /* left side curve inward */
    5% 35%,     /* transition to nose */
    5% 12%,     /* nose left edge */
    10% 5%,     /* top left curve */
    25% 0%      /* close the shape */
  );
}

.skateboard-preview::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 18px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  z-index: 1;
}

.skateboard-preview::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  z-index: 1;
}

.preview-element {
  font-size: 8px;
  pointer-events: none;
  user-select: none;
}

.template-info {
  padding: 16px;
}

.template-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.template-description {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.template-card.selected .template-tag {
  background: #dbeafe;
  color: #3b82f6;
}

.gallery-footer {
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

.use-template-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.use-template-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
}

.use-template-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
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
  .template-gallery-overlay {
    padding: 10px;
  }
  
  .template-gallery-modal {
    max-height: 95vh;
    border-radius: 16px;
  }
  
  .gallery-header {
    padding: 20px;
  }
  
  .header-content h2 {
    font-size: 20px;
  }
  
  .gallery-content {
    padding: 16px;
  }
  
  .templates-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .template-preview {
    height: 140px;
    padding: 16px;
  }
  
  .skateboard-preview {
    width: 50px;
    height: 100px;
  }
  
  .gallery-footer {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
  }
  
  .cancel-btn,
  .use-template-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>