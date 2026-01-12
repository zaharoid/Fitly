export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ['/signin', '/signup', '/signin/magic-link']
  const isPublic = publicPages.includes(to.path)
  
  const { status, data } = useAuth()
  
  if (import.meta.server) {
    if (!data.value?.user && !isPublic) {
      return navigateTo(`/signin?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    
    if (data.value?.user && to.path === '/') {
      return navigateTo('/dashboard')
    }
    return
  }

  if (status.value === 'loading') return

  if (status.value === 'unauthenticated' && !isPublic) {
    return navigateTo(`/signin?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (status.value === 'authenticated' && isPublic && to.path !== '/') {
    return navigateTo('/dashboard')
  }
})
  