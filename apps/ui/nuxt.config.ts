// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],
  colorMode: {
    preference: "light",
    fallback: "light",
    disableTransition: false,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
    "@pinia/colada-nuxt",
    "@nuxt/devtools",
    "@formkit/auto-animate",
    "@nuxtjs/i18n",
    "@nuxtjs/device",
    "@vee-validate/nuxt",
    "dayjs-nuxt",
  ],
  imports: {
    dirs: ["stores"],
  },
  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
        language: "en-US",
        dir: "ltr",
      },
    ],
    defaultLocale: "en",
  },
  routeRules: {
    "/": { prerender: true },
    "/app/**": { ssr: false },
    "/admin/**": { ssr: false },
  },
});
