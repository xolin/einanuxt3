export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth()
  
  // If user is not authenticated, redirect to login
  if (status.value !== 'authenticated') {
    return navigateTo('/Lagin')
  }
})