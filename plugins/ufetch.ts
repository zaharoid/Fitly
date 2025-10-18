// plugins/ufetch.ts
import type { NitroFetchOptions } from 'nitropack'

interface UfetchOptions<T extends string = string> extends NitroFetchOptions<T> {
  disableInterceptors?: boolean
}

export default defineNuxtPlugin(() => {
  function interceptorsUFetch (ctx: { response?: Response; error?: any }) {
    const status = ctx?.response?.status
    // авто-логаут при 401
    if (process.client && status === 401) {
      // не зацикливаемся на /signin
      if (useRoute().name !== 'signin') {
        const { signOut } = useAuth()
        signOut({ callbackUrl: '/signin' })
      }
    }
    // тут же можно обработать 451 / policy и т.п.
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

        // куки на сервере, чтобы SSR держал сессию
        const headers: HeadersInit = {
          ...(process.server ? useRequestHeaders(['cookie']) : undefined),
          ...(other.headers as any),
        }

        // csrf токен из cookie (если подключишь nuxt-csurf)
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
