<template>
  <div>
    <!-- User welcome header -->
    <div class="bg-gray-800 text-white py-4 px-6">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold">Editor de Tablas</h1>
          <p class="text-gray-300 text-sm" v-if="user">
            Bienvenido, {{ user.name || user.email }}
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="saveDesign"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-150"
          >
            Guardar Diseño
          </button>
          <button
            @click="signOut"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-150"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Help section -->
    <div class="bg-blue-50 border-b border-blue-200 py-3 px-6">
      <div class="container mx-auto">
        <p class="text-blue-800 text-sm">
          💡 <strong>Ayuda:</strong> Arrastra elementos al canvas, usa el panel derecho para propiedades, y guarda tu progreso frecuentemente.
          <a href="#tutorial" class="text-blue-600 underline ml-2">Ver tutorial completo</a>
        </p>
      </div>
    </div>

    <!-- Main editor -->
    <Editor />
  </div>
</template>

<script setup>
// Protect this route with authentication
definePageMeta({
  middleware: 'auth'
})

const { data, signOut } = useAuth()
const user = computed(() => data.value?.user)

const saveDesign = () => {
  // TODO: Implement save functionality
  alert('Funcionalidad de guardado próximamente disponible')
}
</script>