import { ref } from 'vue'
import { useAxios } from '@nuxtjs/axios'

export function useAuth() {
  const user = ref(null)
  const error = ref(null)
  const { $axios } = useAxios()

  async function signin(email, password) {
    try {
      const response = await ctx.$axios.$pos('/api/login', { email, password })
      user.value = response.user
    } catch (e) {
      error.value = e.message
    }
  }

  async function signout() {
    try {
      await $axios.$post('/api/logout')
      user.value = null
    } catch (e) {
      error.value = e.message
    }
  }

  return { user, error, signin, signout }
}