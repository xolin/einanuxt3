<template>
  <div>
    <!-- User welcome header -->
    <div class="bg-gray-800 text-white py-4 px-6">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold">Editor de Tablas</h1>
          <p class="text-gray-300 text-sm" v-if="isAuthenticated && user">
            Bienvenido, {{ user.name || user.email }}
          </p>
          <p class="text-gray-300 text-sm" v-else>
            Modo invitado - <a href="/Lagin" class="text-blue-300 underline">Inicia sesión</a> para guardar tus diseños
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="saveDesign"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-150"
            :title="isAuthenticated ? 'Guardar diseño' : 'Inicia sesión para guardar'"
          >
            {{ isAuthenticated ? 'Guardar Diseño' : 'Guardar (Login requerido)' }}
          </button>
          <button
            v-if="isAuthenticated"
            @click="signOut"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-150"
          >
            Cerrar Sesión
          </button>
          <a
            v-else
            href="/Lagin"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-150 inline-block"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>

    <!-- Help section -->
    <div class="bg-blue-50 border-b border-blue-200 py-3 px-6">
      <div class="container mx-auto">
        <p class="text-blue-800 text-sm">
          💡 <strong>Ayuda:</strong> Arrastra elementos al canvas, usa el panel derecho para propiedades.
          <span v-if="isAuthenticated">Guarda tu progreso frecuentemente.</span>
          <span v-else><a href="/Lagin" class="text-blue-600 underline ml-1">Inicia sesión</a> para guardar tus diseños.</span>
          <a href="#tutorial" class="text-blue-600 underline ml-2">Ver tutorial completo</a>
        </p>
      </div>
    </div>

    <!-- Main editor -->
    <Editor />
  </div>
</template>

<script setup>
// No authentication required - editor is accessible to everyone
const { data, signOut, status } = useAuth()
const user = computed(() => data.value?.user)
const isAuthenticated = computed(() => status.value === 'authenticated')

const saveDesign = () => {
  if (!isAuthenticated.value) {
    // If user is not authenticated, prompt them to login to save
    if (confirm('Para guardar tu diseño necesitas iniciar sesión. ¿Quieres ir a la página de login?')) {
      navigateTo('/Lagin')
    }
    return
  }
  
  // TODO: Implement save functionality for authenticated users
  alert('Funcionalidad de guardado próximamente disponible')
}
</script>