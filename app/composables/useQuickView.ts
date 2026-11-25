import type { CatalogProduct } from '~/composables/useCart'

export const useQuickView = () => {
  const product = useState<CatalogProduct | null>('quick-view-product', () => null)
  const open = (item: CatalogProduct) => {
    product.value = item
  }
  const close = () => {
    product.value = null
  }
  return { product, open, close }
}
