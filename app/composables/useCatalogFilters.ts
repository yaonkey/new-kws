import type { CatalogProduct } from '~/composables/useCart'
import {
  getCategoryKey,
  getCategoryLabel,
  getLocalizedField,
  getPriceByLocale,
  getProductEffectivePrice,
  getProductStockStatus,
} from '~/composables/useCatalog'

const STATUS = new Set(['new', 'hit', 'sale', 'pdf'])

export const useCatalogFilters = () => {
  const { t, locale } = useI18n()
  const selectedKey = useState('catalog-selected', () => 'all')
  const inStockOnly = useState('catalog-in-stock', () => false)
  const searchQuery = useState('catalog-search', () => '')

  const { fetchCatalog } = useProductsApi()
  const { data, status, refresh } = useAsyncData(
    () => `products-catalog-${locale.value}`,
    fetchCatalog,
    { watch: [locale], default: () => ({ products: [] }) },
  )

  const products = computed<CatalogProduct[]>(() => (data.value?.products ?? []).filter((product) => !product.is_schema))

  const groupMeta = (product: CatalogProduct) => {
    const named = product.category
    if (typeof named === 'string' && named.trim()) {
      return { key: named.trim().toLowerCase(), label: named.trim() }
    }
    if (named && typeof named === 'object') {
      const ru = named.ru?.trim() || ''
      const en = named.en?.trim() || ''
      const label = locale.value === 'en' ? en || ru : ru || en
      if (label) return { key: (ru || en).toLowerCase(), label }
    }
    const raw = (product.labels || []).find((label) => !STATUS.has(getCategoryKey(label)))
    if (!raw) {
      return { key: 'workshop', label: t('products.workshopGroup') }
    }
    const known = getCategoryLabel(raw, locale.value)
    return { key: getCategoryKey(raw), label: known === getCategoryKey(raw) ? raw : known }
  }

  const matchesSearch = (product: CatalogProduct) => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return true
    const title = getLocalizedField(product.title, locale.value).toLowerCase()
    const description = getLocalizedField(product.description, locale.value).toLowerCase()
    return title.includes(query) || description.includes(query)
  }

  const inStock = (product: CatalogProduct) => getProductStockStatus(product) !== 'out_of_stock'
  const pool = computed(() => products.value.filter((product) => matchesSearch(product) && (!inStockOnly.value || inStock(product))))

  const chips = computed(() => {
    const map = new Map<string, { key: string, label: string, count: number }>()
    pool.value.forEach((product) => {
      const meta = groupMeta(product)
      const current = map.get(meta.key)
      if (current) current.count += 1
      else map.set(meta.key, { ...meta, count: 1 })
    })
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, locale.value))
  })

  const shown = computed(() => (
    selectedKey.value === 'all' ? pool.value : pool.value.filter((product) => groupMeta(product).key === selectedKey.value)
  ))

  const groups = computed(() => {
    const map = new Map<string, { key: string, label: string, items: CatalogProduct[] }>()
    shown.value.forEach((product) => {
      const meta = groupMeta(product)
      const current = map.get(meta.key)
      if (current) current.items.push(product)
      else map.set(meta.key, { ...meta, items: [product] })
    })
    return Array.from(map.values())
  })

  const prices = computed(() => products.value.map((product) => getPriceByLocale(getProductEffectivePrice(product), locale.value)))
  const minPrice = computed(() => prices.value.length ? Math.min(...prices.value) : 0)
  const maxPrice = computed(() => prices.value.length ? Math.max(...prices.value) : 0)
  const stockCount = computed(() => products.value.filter(inStock).length)

  const worksLabel = (count: number) => {
    const mod = Math.abs(count) % 100
    const tail = mod % 10
    if (locale.value !== 'ru') {
      return `${count} ${count === 1 ? 'work' : 'works'}`
    }
    if (mod > 10 && mod < 20) return `${count} работ`
    if (tail === 1) return `${count} работа`
    if (tail > 1 && tail < 5) return `${count} работы`
    return `${count} работ`
  }

  watch(chips, (list) => {
    if (selectedKey.value !== 'all' && !list.some((chip) => chip.key === selectedKey.value)) {
      selectedKey.value = 'all'
    }
  })

  return {
    products,
    status,
    refresh,
    selectedKey,
    inStockOnly,
    searchQuery,
    chips,
    pool,
    shown,
    groups,
    minPrice,
    maxPrice,
    stockCount,
    worksLabel,
  }
}
