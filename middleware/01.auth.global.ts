export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ['/signin', '/signup', '/signin/magic-link']
    const isPublic = publicPages.includes(to.path)
    const router = useRouter();
    const routeTo = (wayStr: string) => {
      if (import.meta.server) return navigateTo(wayStr);
      if (import.meta.client) return router.push({ path: wayStr });
    };
  
    if (import.meta.server) {
      const event = useRequestEvent()

      const headers = event
        ? useRequestHeaders(['cookie'])
        : { cookie: '' }
      const session = await $fetch<{ user?: unknown } | null>('/api/auth/session', {
        headers: { cookie: headers.cookie ?? '' },
      })
      if (!session?.user && !isPublic) {
        return routeTo(`/signin?redirect=${encodeURIComponent(to.fullPath)}`)
      }
      console.log('session', session?.user);
      console.log('to', to.path);
      
      if (session?.user && to.path === '/') {
        return routeTo('/dashboard')
      }
      return
    }
  
    const { status } = useAuth()
    if (status.value === 'loading') return
  
    if (status.value === 'unauthenticated' && !isPublic) {
      return routeTo(`/signin?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  
    if (status.value === 'authenticated' && isPublic && to.path !== '/') {
      return routeTo('/dashboard')
    }
  })
  