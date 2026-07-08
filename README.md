# Kofworkshop (Nuxt 4)

Витрина kofworkshop.cc. Каталог загружается с бекенда [kws-crm](../kws-crm).

## Tech Stack

- Nuxt 4
- @nuxt/image
- @nuxtjs/i18n
- @nuxtjs/tailwindcss
- @nuxtjs/sitemap

## Environment variables

```bash
NUXT_PUBLIC_SITE_URL=https://kofworkshop.cc
NUXT_PUBLIC_API_URL=https://api.kofworkshop.cc
NUXT_PUBLIC_TELEGRAM_USERNAME=your_username
```

Для локальной разработки с CRM на `:8080`:

```bash
NUXT_PUBLIC_API_URL=http://localhost:8080
```

## Development

```bash
yarn install
yarn dev
```

## Production

```bash
yarn build
yarn preview
```

## Deployment

Сайт деплоится на [Vercel](https://vercel.com/). Бекенд и CRM — см. [kws-crm](../kws-crm).

После изменения каталога в CRM запустите rebuild сайта (кнопка в дашборде или Vercel Deploy Hook).
