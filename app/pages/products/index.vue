<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getCategoryKey,
  getCategoryLabel,
  getLocalizedField,
  getPriceByLocale,
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
const selectedCategory = ref('all')

const priceBounds = computed(() => {
  if (!products.value.length) {
    return { min: 0, max: 0 }
  }
  const prices = products.value.map((product) => product.price)
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
  const categoryMap = new Map<string, string>()
  products.value.forEach((product) => {
    getProductCategories(product).forEach((category) => {
      const key = getCategoryKey(category)
      if (!categoryMap.has(key)) {
        categoryMap.set(key, getCategoryLabel(category, locale.value))
      }
    })
  })
  return Array.from(categoryMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return products.value.filter((product) => {
    const localizedTitle = getLocalizedField(product.title, locale.value).toLowerCase()
    const localizedDescription = getLocalizedField(product.description, locale.value).toLowerCase()
    const productCategoryKeys = getProductCategories(product).map((category) => getCategoryKey(category))
    const matchesSearch = !query || localizedTitle.includes(query) || localizedDescription.includes(query)
    const matchesCategory = selectedCategory.value === 'all' || productCategoryKeys.includes(selectedCategory.value)
    const productPrice = getPriceByLocale(product.price, locale.value)
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
      <h1 class="text-3xl font-bold text-stone-900">{{ t('products.title') }}</h1>
      <p class="mt-2 max-w-3xl text-stone-600">{{ t('products.subtitle') }}</p>
    </section>

    <section class="mb-6 rounded-2xl border border-stone-200 bg-white p-4 md:p-5">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('products.searchPlaceholder')"
          class="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600"
        />
        <select v-model="selectedCategory" class="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600">
          <option value="all">{{ t('products.allCategories') }}</option>
          <option v-for="category in categories" :key="category.key" :value="category.key">
            {{ category.label }}
          </option>
        </select>
        <input v-model.number="minPrice" type="number" :min="priceBounds.min" :max="priceBounds.max" class="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600" />
        <input v-model.number="maxPrice" type="number" :min="priceBounds.min" :max="priceBounds.max" class="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600" />
      </div>
    </section>

    <div class="mb-4 text-sm text-stone-600">{{ t('products.results') }}: {{ filteredProducts.length }}</div>

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard v-for="product in filteredProducts" :key="product.slug" :product="product" />
    </section>
  </div>
</template>
