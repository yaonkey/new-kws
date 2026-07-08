import type { CatalogProduct } from '~/composables/useCart'

export interface ProductsCatalog {
  products: CatalogProduct[]
}

export const useProductsApi = () => {
  const config = useRuntimeConfig()

  const fetchCatalog = async (): Promise<ProductsCatalog> => {
    const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
    if (!baseUrl) {
      console.warn('[useProductsApi] NUXT_PUBLIC_API_URL is not set')
      return { products: [] }
    }

    const response = await $fetch<ProductsCatalog>(`${baseUrl}/api/v1/products`)
    return {
      products: response.products ?? [],
    }
  }

  const fetchProduct = async (slug: string): Promise<CatalogProduct | null> => {
    const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
    if (!baseUrl) {
      return null
    }

    try {
      return await $fetch<CatalogProduct>(`${baseUrl}/api/v1/products/${encodeURIComponent(slug)}`)
    } catch {
      return null
    }
  }

  return {
    fetchCatalog,
    fetchProduct,
  }
}
