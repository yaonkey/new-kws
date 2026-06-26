# Kofworkshop Dark Circus (Nuxt 4)

Multilingual handmade workshop showcase with:

- Product catalog and PDF patterns storefront
- Product pages with gallery and cart actions
- LocalStorage cart and Telegram checkout link
- Russian/English support via `@nuxtjs/i18n`
- Dark circus UI theme (black/red/white) with animations
- SEO + OpenGraph + sitemap
- Optimized images via `@nuxt/image`

## Tech Stack

- Nuxt
- @nuxt/content
- @nuxt/image
- @nuxtjs/i18n
- @nuxtjs/tailwindcss
- @nuxtjs/sitemap

## Environment variables

Create `.env`:

```bash
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_TELEGRAM_USERNAME=USERNAME
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

Project is ready for direct deployment to [Vercel](https://vercel.com/).
