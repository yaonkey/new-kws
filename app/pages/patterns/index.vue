<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import { getLocalizedField } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()

const { fetchCatalog } = useProductsApi()

const { data: catalog, status, refresh } = await useAsyncData(
  () => `patterns-catalog-${locale.value}`,
  fetchCatalog,
  {
    watch: [locale],
    default: () => ({ products: [] }),
  },
)
const searchQuery = ref('')

const patterns = computed<CatalogProduct[]>(() => (catalog.value?.products ?? []).filter((product) => product.is_schema))

const filteredPatterns = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return patterns.value
  }

  return patterns.value.filter((pattern) => {
    const localizedTitle = getLocalizedField(pattern.title, locale.value).toLowerCase()
    const localizedDescription = getLocalizedField(pattern.description, locale.value).toLowerCase()
    return localizedTitle.includes(query) || localizedDescription.includes(query)
  })
})

watch(
  () => locale.value,
  () => {
    searchQuery.value = ''
  },
)

onMounted(async () => {
  if (!patterns.value.length) {
    await refresh()
  }
})

useSeoMeta({
  title: t('seo.patternsTitle'),
  description: t('patterns.subtitle'),
  ogTitle: `Kofworkshop - ${t('seo.patternsTitle')}`,
  ogDescription: t('patterns.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/patterns')}`,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${localePath('/patterns')}` }],
})
</script>

<template>
  <div>
    <section class="mb-8">
      <h1 class="circus-heading text-3xl font-bold">{{ t('patterns.title') }}</h1>
      <p class="mt-2 max-w-3xl text-circus-muted">{{ t('patterns.subtitle') }}</p>
    </section>

    <section class="circus-card mb-6 p-4 md:p-5">
      <input
        v-model="searchQuery"
        type="search"
        :placeholder="t('patterns.searchPlaceholder')"
        class="circus-input w-full"
      />
    </section>

    <div class="mb-4 text-sm text-circus-muted">{{ t('patterns.results') }}: {{ filteredPatterns.length }}</div>

    <p v-if="status === 'pending'" class="mb-4 text-sm text-circus-muted">
      {{ t('patterns.loading') }}
    </p>

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard v-for="pattern in filteredPatterns" :key="pattern.slug" :product="pattern" />
    </section>
  </div>
</template>
