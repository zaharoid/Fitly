// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const publicPages = ['/signin', '/signup']
    const isPublic = publicPages.includes(to.path)
  
    // ── SSR: проверяем сессию через /api/auth/session с куками
    if (import.meta.server) {
      const event = useRequestEvent()
      // забираем только cookie, чтобы Auth.js понял сессию
      const headers = event
        ? useRequestHeaders(['cookie'])
        : { cookie: '' }
      const session = await $fetch<{ user?: unknown } | null>('/api/auth/session', {
        headers: { cookie: headers.cookie ?? '' },
      })
  
      if (!session?.user && !isPublic) {
        return navigateTo(`/signin?redirect=${encodeURIComponent(to.fullPath)}`)
      }
      if (session?.user && isPublic) {
        return navigateTo('/')
      }
      return
    }
  
    // ── Клиент: useAuth()/useSession()
    const { status } = useAuth()
    if (status.value === 'loading') return
  
    if (status.value === 'unauthenticated' && !isPublic) {
      return navigateTo(`/signin?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  
    if (status.value === 'authenticated' && isPublic) {
      return navigateTo('/')
    }
  })
  