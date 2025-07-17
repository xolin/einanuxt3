<template>
  <div>
    <!-- User welcome header -->
    <div class="bg-gray-800 text-white py-4 px-6">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold">Editor de Tablas</h1>
          <p class="text-gray-300 text-sm">
            ¡Diseña tu tabla personalizada! Todos los cambios se pueden descargar al finalizar.
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <a
            href="/Lagin"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-150 inline-block"
          >
            Ver Ejemplos
          </a>
        </div>
      </div>
    </div>

    <!-- Help section -->
    <div class="bg-blue-50 border-b border-blue-200 py-3 px-6">
      <div class="container mx-auto">
        <p class="text-blue-800 text-sm">
          💡 <strong>Ayuda:</strong> Arrastra elementos al canvas, usa el panel derecho para propiedades.
          <a href="#tutorial" class="text-blue-600 underline ml-2">Ver tutorial completo</a>
        </p>
      </div>
    </div>

    <!-- Main editor -->
    <Editor />
  </div>
</template>

<script setup>
// Editor is accessible to everyone - no authentication required
// Remove save functionality since no backend auth
</script>