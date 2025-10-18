declare module '#app' {
    interface NuxtApp {
      $ufetch: <T>(resource: string, options?: import('nitropack').NitroFetchOptions<string> & { disableInterceptors?: boolean }) => Promise<T>
    }
  }
  export {}