// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxt/image',
  ],
  css: ['~/assets/css/tailwind.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      titleTemplate: '%s | Kofworkshop',
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Kofworkshop handmade toys and PDF patterns catalog.',
        },
        { name: 'theme-color', content: '#0a0a0f' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080',
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
  image: {
    quality: 90,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
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
