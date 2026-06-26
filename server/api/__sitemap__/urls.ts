export default defineEventHandler(async (event) => {
  const staticPaths = ['/', '/products', '/patterns', '/cart']
  const locales = ['ru', 'en']

  const localizedStaticUrls = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      loc: `/${locale}${path}`,
    })),
  )

  const catalog = await queryCollection(event, 'products').first()
  const products = catalog?.products ?? []
  const productUrls = locales.flatMap((locale) =>
    products.map((product: { slug: string }) => ({
      loc: `/${locale}/products/${product.slug}`,
    })),
  )

  return [...localizedStaticUrls, ...productUrls]
})
