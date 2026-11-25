<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import { getLocalizedField } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const { open } = useQuickView()

const { fetchCatalog } = useProductsApi()
const { data: catalog, status, refresh } = await useAsyncData(
  () => `patterns-catalog-${locale.value}`,
  fetchCatalog,
  { watch: [locale], default: () => ({ products: [] }) },
)
const searchQuery = ref('')

const patterns = computed<CatalogProduct[]>(() =>
  (catalog.value?.products ?? []).filter((product) => product.is_schema || product.hasPdf),
)

const filteredPatterns = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return patterns.value
  return patterns.value.filter((pattern) => {
    const title = getLocalizedField(pattern.title, locale.value).toLowerCase()
    const description = getLocalizedField(pattern.description, locale.value).toLowerCase()
    return title.includes(query) || description.includes(query)
  })
})

watch(() => locale.value, () => { searchQuery.value = '' })

onMounted(async () => {
  if (!patterns.value.length) await refresh()
})

useSeoMeta({
  title: t('seo.patternsTitle'),
  description: t('patterns.subtitle'),
  ogTitle: `Kofworkshop - ${t('seo.patternsTitle')}`,
  ogDescription: t('patterns.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/patterns')}`,
})
</script>

<template>
  <div>
    <p class="text-xs uppercase tracking-[0.22em] text-circus-red">{{ t('patterns.eyebrow') }}</p>
    <h1 class="circus-heading mt-2 text-5xl font-bold md:text-7xl">{{ t('patterns.title') }}</h1>
    <p class="script mt-2 text-2xl text-[#f3c7cb]">{{ t('patterns.handLine') }}</p>
    <p class="mt-3 max-w-2xl text-circus-muted">{{ t('patterns.subtitle') }}</p>

    <input v-model="searchQuery" type="search" :placeholder="t('patterns.searchPlaceholder')" class="circus-input mt-6 w-full max-w-md bg-white/10">
    <p class="mt-3 text-sm text-circus-muted">{{ t('patterns.results') }}: {{ filteredPatterns.length }}</p>
    <div v-if="status === 'pending' && !patterns.length" class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
      <div v-for="n in 4" :key="n" class="skeleton-card" />
    </div>
    <section v-else class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
      <div v-for="(pattern, index) in filteredPatterns" :key="pattern.slug" v-reveal class="reveal" :style="{ '--rd': `${index * 70}ms` }">
        <ProductCard :product="pattern" cart-mode="pdf" @zoom="open(pattern)" />
      </div>
    </section>
  </div>
</template>
