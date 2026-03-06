export default defineEventHandler(async (event) => {
  const staticPaths = ['/', '/products', '/blog', '/cart', '/about']
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

  const blogPosts = await queryCollection(event, 'blog').all()
  const blogUrls = locales.flatMap((locale) =>
    blogPosts.map((post: { slug: string; date?: string }) => ({
      loc: `/${locale}/blog/${post.slug}`,
      lastmod: post.date,
    })),
  )

  return [...localizedStaticUrls, ...productUrls, ...blogUrls]
})
