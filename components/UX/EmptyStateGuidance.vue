<template>
  <div v-if="isVisible" class="empty-state-overlay">
    <div class="empty-state-content">
      <div class="empty-state-animation">
        <div class="skateboard-icon">🛹</div>
        <div class="sparkles">
          <span class="sparkle">✨</span>
          <span class="sparkle">✨</span>
          <span class="sparkle">✨</span>
        </div>
      </div>
      
      <h3 class="empty-state-title">¡Tu lienzo está esperando!</h3>
      <p class="empty-state-description">
        Comienza creando tu tabla personalizada. Aquí tienes algunas ideas para empezar:
      </p>
      
      <div class="quick-actions">
        <button 
          class="quick-action-btn" 
          title="Añadir texto personalizado"
          @click="$emit('action', 'add-text')"
        >
          <span class="action-icon">📝</span>
          <span class="action-label">Añadir Texto</span>
          <span class="action-description">Escribe tu nombre o frase favorita</span>
        </button>
        
        <button 
          class="quick-action-btn" 
          title="Cambiar color de fondo"
          @click="$emit('action', 'deck-color')"
        >
          <span class="action-icon">🎨</span>
          <span class="action-label">Elegir Color</span>
          <span class="action-description">Cambia el color de fondo de tu tabla</span>
        </button>
        
        <button 
          class="quick-action-btn" 
          title="Explorar emojis"
          @click="$emit('action', 'add-emoji')"
        >
          <span class="action-icon">😊</span>
          <span class="action-label">Añadir Emoji</span>
          <span class="action-description">Busca entre cientos de emojis</span>
        </button>
        
        <button 
          class="quick-action-btn" 
          title="Subir imagen propia"
          @click="$emit('action', 'upload-image')"
        >
          <span class="action-icon">📷</span>
          <span class="action-label">Subir Imagen</span>
          <span class="action-description">Usa tu propia foto o logo</span>
        </button>
        
        <button 
          class="quick-action-btn template-action" 
          title="Explorar plantillas pre-diseñadas"
          @click="$emit('action', 'browse-templates')"
        >
          <span class="action-icon">🎨</span>
          <span class="action-label">Usar Plantilla</span>
          <span class="action-description">Comienza con un diseño pre-hecho</span>
        </button>
      </div>
      
      <div class="tips-section">
        <h4 class="tips-title">💡 Consejos útiles:</h4>
        <ul class="tips-list">
          <li><strong>Arrastra</strong> elementos para moverlos por la tabla</li>
          <li><strong>Haz clic</strong> en un elemento para seleccionarlo y editarlo</li>
          <li><strong>Usa el zoom</strong> para ver tu diseño más de cerca</li>
          <li><strong>Descarga</strong> tu diseño cuando esté listo</li>
        </ul>
      </div>
      
      <div class="dismiss-section">
        <button class="dismiss-btn" @click="$emit('dismiss')">
          No mostrar de nuevo
        </button>
        <button class="close-btn" @click="$emit('close')">
          <span class="material-symbols-sharp">close</span>
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

const emit = defineEmits(['action', 'close', 'dismiss'])
</script>

<style scoped>
.empty-state-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 500px;
  width: 90%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInScale 0.5s ease-out;
}

.empty-state-content {
  text-align: center;
}

.empty-state-animation {
  position: relative;
  margin-bottom: 1.5rem;
}

.skateboard-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  animation: bounce 2s infinite;
}

.sparkles {
  position: relative;
  height: 20px;
}

.sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkle 1.5s infinite;
}

.sparkle:nth-child(1) {
  left: 20%;
  animation-delay: 0s;
}

.sparkle:nth-child(2) {
  left: 50%;
  animation-delay: 0.5s;
}

.sparkle:nth-child(3) {
  left: 80%;
  animation-delay: 1s;
}

.empty-state-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.empty-state-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.quick-action-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.quick-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.quick-action-btn:hover::before {
  left: 100%;
}

.quick-action-btn:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.template-action:hover {
  border-color: #8b5cf6;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
}

.template-action .action-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.75rem;
}

.action-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.action-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.action-description {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.3;
}

.tips-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.tips-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  space-y: 0.5rem;
}

.tips-list li {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.tips-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

.dismiss-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dismiss-btn {
  font-size: 0.875rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.dismiss-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .empty-state-overlay {
    width: 95%;
    padding: 1.5rem;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .empty-state-title {
    font-size: 1.5rem;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .quick-action-btn {
    padding: 1rem;
  }
  
  .tips-section {
    padding: 1.25rem;
  }
  
  .skateboard-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .empty-state-overlay {
    padding: 1.25rem;
  }
  
  .empty-state-title {
    font-size: 1.375rem;
  }
  
  .empty-state-description {
    font-size: 0.875rem;
  }
}
</style>