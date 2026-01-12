// plugins/ufetch.ts
import type { NitroFetchOptions } from 'nitropack'

interface UfetchOptions<T extends string = string> extends NitroFetchOptions<T> {
  disableInterceptors?: boolean
}

export default defineNuxtPlugin(() => {
  function interceptorsUFetch (ctx: { response?: Response; error?: any }) {
    const status = ctx?.response?.status
    // Auto-logout on 401
    if (process.client && status === 401) {
      // Avoid redirect loop on /signin
      if (useRoute().name !== 'signin') {
        const { signOut } = useAuth()
        signOut({ callbackUrl: '/signin' })
      }
    }
    // Handle 451 / policy errors here if needed
  }

  return {
    provide: {
      async ufetch<T> (resource: string, options?: UfetchOptions) {
        const {
          onRequest = () => {},
          onResponse = () => {},
          disableInterceptors = false,
          ...other
        } = options || {}

        // Pass cookies on server to maintain SSR session
        const headers: HeadersInit = {
          ...(process.server ? useRequestHeaders(['cookie']) : undefined),
          ...(other.headers as any),
        }

        // CSRF token from cookie (if using nuxt-csurf)
        const csrf = process.client ? useCookie('csrf').value : undefined
        if (csrf && other.method && other.method !== 'GET') {
          (headers as Record<string, string>)['x-csrf-token'] = csrf as string
        }

        return $fetch<T>(resource, {
          credentials: 'include',
          retry: 0,
          headers,
          onRequest,
          onResponse: (args) => {
            if (!disableInterceptors) interceptorsUFetch(args)
            onResponse(args)
          },
          onResponseError: (args) => {
            if (!disableInterceptors) interceptorsUFetch(args)
          },
          ...other,
        })
      },
    },
  }
}
)
