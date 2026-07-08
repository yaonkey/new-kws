export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const staticPaths = ['/', '/products', '/patterns', '/cart', '/socials']
  const locales = ['ru', 'en']

  const localizedStaticUrls = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      loc: `/${locale}${path}`,
    })),
  )

  const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
  let products: { slug: string }[] = []

  if (baseUrl) {
    try {
      const catalog = await $fetch<{ products: { slug: string }[] }>(`${baseUrl}/api/v1/products`)
      products = catalog.products ?? []
    } catch {
      products = []
    }
  }

  const productUrls = locales.flatMap((locale) =>
    products.map((product) => ({
      loc: `/${locale}/products/${product.slug}`,
    })),
  )

  return [...localizedStaticUrls, ...productUrls]
})
