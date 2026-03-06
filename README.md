# Handmade Workshop Showcase (Nuxt 3/4)

Multilingual handmade workshop showcase with:

- Product catalog (about 60 products)
- Product pages with cart actions
- LocalStorage cart and Telegram checkout link
- Blog powered by `@nuxt/content`
- Russian/English support via `@nuxtjs/i18n`
- TailwindCSS UI
- SEO + OpenGraph + sitemap

## Tech Stack

- Nuxt
- @nuxt/content
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
