<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getCategoryKey,
  getCategoryLabel,
  getLocalizedField,
  getPriceByLocale,
  getProductEffectivePrice,
  getProductCategories,
} from '~/composables/useCatalog'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()

const loadProductsCatalog = async () => {
  const byPath = await queryCollection('products').path('/products/catalog').first()
  if (byPath?.products) {
    return byPath
  }
  const all = await queryCollection('products').all()
  return all.find((entry) => Array.isArray(entry.products)) || { products: [] }
}

const { data: catalog, refresh } = await useAsyncData(
  () => `products-catalog-${locale.value}`,
  loadProductsCatalog,
  {
    watch: [locale],
    default: () => ({ products: [] }),
  },
)

const products = computed<CatalogProduct[]>(() => (catalog.value?.products ?? []).filter((product) => !product.is_schema))
const searchQuery = ref('')
const selectedLabel = ref('all')

const priceBounds = computed(() => {
  if (!products.value.length) {
    return { min: 0, max: 0 }
  }
  const prices = products.value.map((product) => getProductEffectivePrice(product))
  const localizedPrices = prices.map((price) => getPriceByLocale(price, locale.value))
  return { min: Math.min(...localizedPrices), max: Math.max(...localizedPrices) }
})

const minPrice = ref(0)
const maxPrice = ref(0)

watchEffect(() => {
  if (!minPrice.value && !maxPrice.value && priceBounds.value.max) {
    minPrice.value = priceBounds.value.min
    maxPrice.value = priceBounds.value.max
  }
})

const categories = computed(() => {
  const labelMap = new Map<string, string>()
  products.value.forEach((product) => {
    getProductCategories(product).forEach((label) => {
      const key = getCategoryKey(label)
      if (!labelMap.has(key)) {
        labelMap.set(key, getCategoryLabel(label, locale.value))
      }
    })
  })
  return Array.from(labelMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return products.value.filter((product) => {
    const localizedTitle = getLocalizedField(product.title, locale.value).toLowerCase()
    const localizedDescription = getLocalizedField(product.description, locale.value).toLowerCase()
    const productLabelKeys = getProductCategories(product).map((label) => getCategoryKey(label))
    const matchesSearch = !query || localizedTitle.includes(query) || localizedDescription.includes(query)
    const matchesCategory = selectedLabel.value === 'all' || productLabelKeys.includes(selectedLabel.value)
    const productPrice = getPriceByLocale(getProductEffectivePrice(product), locale.value)
    const matchesPrice = productPrice >= minPrice.value && productPrice <= maxPrice.value
    return matchesSearch && matchesCategory && matchesPrice
  })
})

onMounted(async () => {
  if (!products.value.length) {
    await refresh()
  }
})

useSeoMeta({
  title: t('seo.productsTitle'),
  description: t('products.subtitle'),
  ogTitle: `Handmade Workshop - ${t('seo.productsTitle')}`,
  ogDescription: t('products.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/products')}`,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${localePath('/products')}` }],
})
</script>

<template>
  <div>
    <section class="mb-8">
      <h1 class="circus-heading text-3xl font-bold">{{ t('products.title') }}</h1>
      <p class="mt-2 max-w-3xl text-circus-muted">{{ t('products.subtitle') }}</p>
    </section>

    <section class="circus-card mb-6 p-4 md:p-5">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('products.searchPlaceholder')"
          class="circus-input"
        />
        <select v-model="selectedLabel" class="circus-input">
          <option value="all">{{ t('products.allCategories') }}</option>
          <option v-for="category in categories" :key="category.key" :value="category.key">
            {{ category.label }}
          </option>
        </select>
        <input v-model.number="minPrice" type="number" :min="priceBounds.min" :max="priceBounds.max" class="circus-input" />
        <input v-model.number="maxPrice" type="number" :min="priceBounds.min" :max="priceBounds.max" class="circus-input" />
      </div>
    </section>

    <div class="mb-4 text-sm text-circus-muted">{{ t('products.results') }}: {{ filteredProducts.length }}</div>

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard v-for="product in filteredProducts" :key="product.slug" :product="product" />
    </section>
  </div>
</template>
