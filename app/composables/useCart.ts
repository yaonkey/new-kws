import { getPrimaryProductImage, normalizePriceValue, type PriceValue } from '~/composables/useCatalog'

export type CartItemKind = 'product' | 'pdf'

export interface CatalogProduct {
  slug: string
  category?: string
  title: {
    ru: string
    en: string
  }
  description: {
    ru: string
    en: string
  }
  details?: {
    ru?: string
    en?: string
  }
  price: number | PriceValue
  image: string | string[]
  hasPdf?: boolean
  pdfPrice?: number | PriceValue
}

export interface CartItem {
  id: string
  kind: CartItemKind
  slug: string
  title: {
    ru: string
    en: string
  }
  price: PriceValue
  image: string
  quantity: number
}

const STORAGE_KEY = 'kws-cart-v1'
const PDF_SUFFIX = {
  ru: ' (PDF-описание)',
  en: ' (PDF description)',
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart-items', () => [])
  const initialized = useState<boolean>('cart-initialized', () => false)

  const makeItemId = (slug: string, kind: CartItemKind) => `${kind}:${slug}`
  const getPdfPrice = (product: CatalogProduct) => normalizePriceValue(product.pdfPrice ?? { rub: 110, usd: 2 })
  const findItemById = (itemId: string) => items.value.find((item) => item.id === itemId)

  if (import.meta.client && !initialized.value) {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<CartItem>[]
        if (Array.isArray(parsed)) {
          items.value = parsed
            .filter((item) => item && typeof item.slug === 'string' && item.title && item.price !== undefined)
            .map((item) => {
              const kind = item.kind === 'pdf' ? 'pdf' : 'product'
              const id = item.id || makeItemId(String(item.slug), kind)
              return {
                id,
                kind,
                slug: String(item.slug),
                title: item.title as { ru: string; en: string },
                price: normalizePriceValue(item.price as number | PriceValue),
                image: String(item.image || '/images/product-placeholder.svg'),
                quantity: Math.max(1, Number(item.quantity || 1)),
              }
            })
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    initialized.value = true

    watch(
      items,
      (nextItems) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems))
      },
      { deep: true },
    )
  }

  const itemCount = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((acc, item) => acc + item.price.usd * item.quantity, 0))
  const totals = computed(() => {
    return items.value.reduce(
      (acc, item) => {
        acc.usd += item.price.usd * item.quantity
        acc.rub += item.price.rub * item.quantity
        return acc
      },
      { usd: 0, rub: 0 },
    )
  })

  const addItem = (product: CatalogProduct) => {
    const itemId = makeItemId(product.slug, 'product')
    const existingItem = findItemById(itemId)
    if (existingItem) {
      existingItem.quantity += 1
      return
    }

    items.value.push({
      id: itemId,
      kind: 'product',
      slug: product.slug,
      title: product.title,
      price: normalizePriceValue(product.price),
      image: getPrimaryProductImage(product),
      quantity: 1,
    })
  }

  const addPdfItem = (product: CatalogProduct) => {
    if (!product.hasPdf) {
      return
    }

    const itemId = makeItemId(product.slug, 'pdf')
    const existingItem = findItemById(itemId)
    if (existingItem) {
      existingItem.quantity += 1
      return
    }

    items.value.push({
      id: itemId,
      kind: 'pdf',
      slug: product.slug,
      title: {
        ru: `${product.title.ru}${PDF_SUFFIX.ru}`,
        en: `${product.title.en}${PDF_SUFFIX.en}`,
      },
      price: getPdfPrice(product),
      image: getPrimaryProductImage(product),
      quantity: 1,
    })
  }

  const incrementItem = (itemId: string) => {
    const item = findItemById(itemId)
    if (!item) {
      return
    }
    item.quantity += 1
  }

  const removeItem = (itemId: string) => {
    items.value = items.value.filter((item) => item.id !== itemId)
  }

  const decrementItem = (itemId: string) => {
    const item = findItemById(itemId)
    if (!item) {
      return
    }

    item.quantity -= 1
    if (item.quantity <= 0) {
      removeItem(itemId)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    itemCount,
    totalPrice,
    totals,
    addItem,
    addPdfItem,
    incrementItem,
    removeItem,
    decrementItem,
    clearCart,
  }
}
