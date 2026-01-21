// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n','@pinia/nuxt'],
  i18n: {
    locales: [
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.js', },
      { code: 'en', name: 'English', file: 'en.js', },
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:8000/api/v1',
    },
  },
  css: [ 'bootstrap/dist/css/bootstrap.min.css', '@/public/assets/css/toast.css' ],
  app: {
    head: {
      link: [
        { rel: "stylesheet", href: "/assets/css/custom.css" },
        // { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css' },
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', defer: true, }
      ],
    }
  }
})
