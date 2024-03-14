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
                  </div>
                  <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div class="text-gray-500 text-center mb-3 font-bold">
                      <small>Sign in with credentials</small>
                    </div>
                    <form>
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
                      <div class="text-center mt-6">
                        <button
                        @click="handleSignin"
                          class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                          type="button"
                          style="transition: all 0.15s ease 0s;"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                    <div>
                        Is user logged in?
                        <span>{{ loggedIn ? 'yes' : 'no' }}</span>
                    </div>
                    <div v-if="loggedIn">
                        What is users name?
                        <span>{{ user.name }}</span>
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>

  //import { useRouter } from 'vue-router'
  import { ref } from 'vue'

  import { useNuxtApp } from '#app'
  import { useAuth } from '~/composables/useAuth'


  // import { useAuth } from '@nuxtjs/auth-next'

  //const { $sanctumAuth } = useNuxtApp()
  //const router = useRouter()
  const errors = ref([])
  const email = ref('')
  const password = ref('')
  const { user, error, signin, signout } = useAuth()

  async function handleSignin() {
    await signin(email.value, password.value)
  }

  async function handleSignout() {
    await signout()
  }
  
  // async function signin() {
  //   try {
  //     await $sanctumAuth.login(
  //       {
  //         email: email.value,
  //         password: password.value
  //       },
  //       (data) => {
  //         console.log(data)
  //         router.push('/lagin')
  //       }
  //     )
  //   } catch (e) {
  //     errors.value = e.errors
  //   }
  // }
  




  // async function signin(){
  //   const nuxtApp = useNuxtApp()
  //   const $auth = nuxtApp.$auth
  //     errors.value = null

  //     try{ 
  //       await $auth.loginWith('laravelSanctum', {
  //         data: {
  //           email: 'jo@jo.com',
  //           password: '123456'
  //         }
  //       })
  //     } catch(e) {
  //         errors.value = e.response ? e.response.data : e.toString()
  //       }
    
  // }

    // function signin() {
    // $this.$auth.loginWith('laravelSanctum', {
    //     data: {
    //         email: 'jo@jo.com',
    //         password: '123456'
    //     }
    //     })
    // }
//    import { FetchError } from 'ofetch';
//    const { login } = useSanctumAuth();

//     interface MyCustomUser {
//         id: number;
//         login: string;
//     }

// const user = useSanctumUser<MyCustomUser>();

//   async function signin(){
//         const userCredentials = {
//             email: 'jo@jo.com',
//             password: '123456',
//         };
        

//         try{
//             await login(userCredentials);
//         } catch (error:any) {
//             console.log(error.response)
//             console.log(error)
//         }
//     }
    </script>
  