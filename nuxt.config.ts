import { fileURLToPath, URL } from 'node:url';
import stylelint from 'vite-plugin-stylelint';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      hotjarId: process.env.NUXT_PUBLIC_HOTJAR_ID || '',
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
  app: {
    head: {
      link: [{
        rel: 'icon',
        type: 'image/svg',
        href: '/favicon.svg',
      }],
    },
  },
  $development: {
    devServer: {
      // https: {
      //   key: 'ssl-key.pem',
      //   cert: 'ssl-cert.pem',
      // },
    },
  },
  modules: [
    '@ant-design-vue/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/stylelint-module',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vee-validate/nuxt',
    'nuxt-module-hotjar',
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
  ],
  devtools: {
    enabled: true,
  },
  eslint: {
    cache: false,
    lintOnStart: false,
    emitWarning: true,
    emitError: true,
  },
  stylelint: {
    cache: false,
    lintOnStart: false,
  },
  css: [
    '~/assets/scss/main.scss',
  ],
  tailwindcss: {
    cssPath: '~/assets/scss/main.scss',
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en-US.ts',
      },
    ],
    strategy: 'no_prefix',
    // lazy: true, // doesn't work correctly with no_prefix strategy
    langDir: 'lang',
    defaultLocale: 'en',
  },
  googleFonts: {
    families: {
      Inter: {
        wght: [400, 500, 600, 700],
        ital: [400, 500, 600, 700],
      },
    },
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
  // auto import components
  components: [{
    pathPrefix: false,
    path: '~/components',
    extensions: ['vue'],
  }],
  vite: {
    plugins: [stylelint()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math"; @import "./assets/scss/settings-tools";',
          quietDeps: true,
        },
      },
    },
  },
});