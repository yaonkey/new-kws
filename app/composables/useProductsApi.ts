import { mockProducts } from '~/data/mockCatalog'
import type { CatalogProduct } from '~/composables/useCart'

export interface ProductsCatalog {
  products: CatalogProduct[]
}

export const useProductsApi = () => {
  const config = useRuntimeConfig()

  const fetchCatalog = async (): Promise<ProductsCatalog> => {
    const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
    if (!baseUrl) {
      return import.meta.dev ? { products: mockProducts } : { products: [] }
    }

    try {
      const response = await $fetch<ProductsCatalog>(`${baseUrl}/api/v1/products`)
      const products = response.products ?? []
      if (products.length || !import.meta.dev) {
        return { products }
      }
    } catch (error) {
      if (!import.meta.dev) {
        console.warn('[useProductsApi] catalog request failed', error)
        return { products: [] }
      }
    }
    return { products: mockProducts }
  }

  const fetchProduct = async (slug: string): Promise<CatalogProduct | null> => {
    const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
    if (!baseUrl) {
      return import.meta.dev ? mockProducts.find((item) => item.slug === slug) ?? null : null
    }

    try {
      return await $fetch<CatalogProduct>(`${baseUrl}/api/v1/products/${encodeURIComponent(slug)}`)
    } catch {
      return import.meta.dev ? mockProducts.find((item) => item.slug === slug) ?? null : null
    }
  }

  return {
    fetchCatalog,
    fetchProduct,
  }
}
