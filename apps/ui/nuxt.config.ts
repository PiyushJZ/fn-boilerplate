// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxt/devtools',
    '@formkit/auto-animate',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/device',
    'nuxt-csurf',
    'nuxt-security',
    '@vee-validate/nuxt',
    'dayjs-nuxt'
  ]
})