import { fileURLToPath, URL } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  alias: {
    '~t': fileURLToPath(new URL('./types', import.meta.url)),
    '~x': fileURLToPath(new URL('./composables', import.meta.url)),
    '~m': fileURLToPath(new URL('./mappers', import.meta.url)),
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    public: {
      apiBase: '',
      urlServices: '',
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV,
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION,
    },
    email: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
      from: process.env.EMAIL_FROM,
    },
    auth: {
      isEnabled: true,
      baseURL: '/api/auth',
      provider: { type: 'authjs' },
      globalAppMiddleware: false
    },
    tokenParams: {
      secretKey: 'thisisahellbelivemeiveseenit',
    },
  },
  experimental: {
    buildCache: true,
    viewTransition: false,
  },
  nitro: {
    devProxy: {},
    experimental: {
      tasks: false,
    },
  },
  modules: [
    '@ant-design-vue/nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vee-validate/nuxt',
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
  ],
  antd: {
    extractStyle: true,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: false,
    },
  },
  css: [
    '~/assets/scss/main.scss',
  ],
  tailwindcss: {
    cssPath: '~/assets/scss/main.scss',
  },
  googleFonts: {
    families: {
      Inter: {
        wght: [400, 500, 600, 700],
        ital: [400, 500, 600, 700],
      },
    },
    display: 'swap',
    preload: true,
    prefetch: true,
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VForm',
      Field: 'VField',
      FieldArray: 'VFieldArray',
      ErrorMessage: 'VErrorMessage',
    },
  },
  imports: {
    dirs: [
      './stores',
      './composables/**/*.ts',
    ],
  },
  components: [{
    pathPrefix: false,
    path: '~/components',
    extensions: ['vue'],
  }],
  vite: {
    warmupEntry: false,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math"; @use "./assets/scss/settings-tools" as *;',
          silenceDeprecations: ['import', 'global-builtin'],
          quietDeps: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'pinia',
      ],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});