<template>
    <div>
      <main>
        <section class="absolute w-full h-full">
          <div
            class="absolute top-0 w-full h-full bg-gray-900"
            style="background-size: 100%; background-repeat: no-repeat;"
          ></div>
          <div class="container mx-auto px-4 h-full">
            <div class="flex content-center items-center justify-center h-full">
              <div class="w-full lg:w-4/12 px-4">
                <div
                  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
                >
                  <div class="rounded-t mb-0 px-6 py-6">
                    <div class="text-center mb-3">
                      <h6 class="text-gray-600 text-sm font-bold">
                        Welcome to Custom Decks
                      </h6>
                    </div>
                    <hr class="mt-6 border-b-1 border-gray-400" />
                  </div>
                  <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div class="text-gray-500 text-center mb-3 font-bold">
                      <small>Sign in to design your skateboard</small>
                    </div>
                    
                    <!-- Demo credentials info -->
                    <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                      <p class="text-sm"><strong>Demo Login:</strong></p>
                      <p class="text-xs">Email: user@example.com</p>
                      <p class="text-xs">Password: password</p>
                    </div>

                    <form @submit.prevent="handleLogin">
                      <div class="relative w-full mb-3">
                        <label
                          class="block uppercase text-gray-700 text-xs font-bold mb-2"
                          for="grid-password"
                          >Email</label
                        >
                        <input
                          v-model="email"
                          type="email"
                          class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Email"
                          style="transition: all 0.15s ease 0s;"
                          required
                        />
                      </div>
                      <div class="relative w-full mb-3">
                        <label
                          class="block uppercase text-gray-700 text-xs font-bold mb-2"
                          for="grid-password"
                          >Password</label
                        ><input
                          v-model="password"
                          type="password"
                          class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Password"
                          style="transition: all 0.15s ease 0s;"
                          required
                        />
                      </div>
                      <div>
                        <label class="inline-flex items-center cursor-pointer"
                          ><input
                            id="customCheckLogin"
                            type="checkbox"
                            class="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                            style="transition: all 0.15s ease 0s;"
                          /><span class="ml-2 text-sm font-semibold text-gray-700"
                            >Remember me</span
                          ></label
                        >
                      </div>
                      
                      <!-- Error message -->
                      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p class="text-sm">{{ error }}</p>
                      </div>
                      
                      <!-- Loading state -->
                      <div class="text-center mt-6">
                        <button
                          :disabled="loading"
                          :class="{ 'opacity-50 cursor-not-allowed': loading }"
                          class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                          type="submit"
                          style="transition: all 0.15s ease 0s;"
                        >
                          <span v-if="loading">Signing in...</span>
                          <span v-else>Sign In</span>
                        </button>
                      </div>
                    </form>
                    
                    <!-- Auth status info -->
                    <div class="mt-6 p-4 bg-gray-100 rounded">
                      <div class="text-sm text-gray-600">
                        <p><strong>Status:</strong> {{ loggedIn ? 'Logged in' : 'Not logged in' }}</p>
                        <p v-if="user"><strong>User:</strong> {{ user.name || user.email }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap mt-6">
                  <div class="w-1/2">
                    <a href="#pablo" class="text-gray-300"
                      ><small>Forgot password?</small></a
                    >
                  </div>
                  <div class="w-1/2 text-right">
                    <a href="#pablo" class="text-gray-300"
                      ><small>Create new account</small></a
                    >
                  </div>
                </div>
                
                <!-- Navigation help -->
                <div class="mt-6 text-center">
                  <p class="text-gray-300 text-sm">
                    After login, you'll be redirected to the 
                    <a href="/editor" class="text-blue-300 underline">deck editor</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const { data, signIn, status } = useAuth()
  
  const user = computed(() => data.value?.user)
  const loggedIn = computed(() => status.value === 'authenticated')
  
  const email = ref('user@example.com')
  const password = ref('password')
  const loading = ref(false)
  const error = ref('')

  const handleLogin = async () => {
    if (loading.value) return
    
    loading.value = true
    error.value = ''
    
    try {
      const result = await signIn('credentials', {
        email: email.value,
        password: password.value,
        redirect: false
      })
      
      if (result?.error) {
        error.value = 'Login failed. Please check your credentials.'
      } else {
        // Redirect on successful login
        await router.push('/editor')
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'Login failed. Please check your credentials.'
    } finally {
      loading.value = false
    }
  }
  </script>