// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
  ],
  css: ['~/assets/css/tailwind.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      titleTemplate: '%s | Kofworkshop',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Handmade workshop showcase with product catalog and blog.',
        },
        { name: 'theme-color', content: '#047857' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      telegramUsername: process.env.NUXT_PUBLIC_TELEGRAM_USERNAME || 'USERNAME',
    },
  },
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'ru',
    lazy: true,
    langDir: 'locales',
    locales: [
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
    ],
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  routeRules: {
    '/': { prerender: true },
    '/ru/**': { prerender: true },
    '/en/**': { prerender: true },
    '/sitemap.xml': { prerender: true },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
