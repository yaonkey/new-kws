<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const { open } = useQuickView()
const listKey = ref(0)

const {
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
} = useCatalogFilters()

watch([selectedKey, inStockOnly, searchQuery], () => {
  listKey.value += 1
})

onMounted(async () => {
  if (!products.value.length) await refresh()
})

useSeoMeta({
  title: t('seo.productsTitle'),
  description: t('products.subtitle'),
  ogTitle: `Kofworkshop - ${t('seo.productsTitle')}`,
  ogDescription: t('products.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/products')}`,
})
</script>

<template>
  <div>
    <section class="grid items-end gap-6 md:grid-cols-[1.3fr_0.7fr]">
      <div>
        <p class="text-xs uppercase tracking-[0.22em] text-circus-red">{{ t('products.eyebrow') }}</p>
        <h1 class="circus-heading mt-2 text-5xl font-bold md:text-7xl">{{ t('products.title') }}</h1>
        <svg class="zigzag mt-2 h-4 w-36 text-circus-red" viewBox="0 0 140 16" fill="none" aria-hidden="true">
          <path d="M2 12 L14 4 L26 12 L38 4 L50 12 L62 4 L74 12 L86 4 L98 12 L110 4 L122 12 L134 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="script mt-2 text-2xl text-[#f3c7cb]">{{ t('products.handLine') }}</p>
        <p class="mt-3 max-w-xl text-circus-muted">
          {{ t('products.summary', { count: products.length, min: minPrice, max: maxPrice }) }}
        </p>
      </div>
      <aside class="paper p-5">
        <p class="script text-2xl text-circus-red">{{ t('products.onTheTable') }}</p>
        <dl class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <dt class="text-2xl font-bold">{{ products.length }}</dt>
            <dd class="text-xs paper-muted">{{ t('products.works') }}</dd>
          </div>
          <div>
            <dt class="text-2xl font-bold">{{ stockCount }}</dt>
            <dd class="text-xs paper-muted">{{ t('products.stock.in_stock') }}</dd>
          </div>
          <div>
            <dt class="text-2xl font-bold">{{ minPrice || '—' }}</dt>
            <dd class="text-xs paper-muted">{{ t('products.fromPrice') }}</dd>
          </div>
        </dl>
      </aside>
    </section>

    <section class="mt-8">
      <div class="flex flex-wrap items-center gap-3">
        <div class="catalog-nav">
          <button class="chip" :class="{ 'is-on': selectedKey === 'all' }" @click="selectedKey = 'all'">
            {{ t('products.allWorks') }}
            <span class="chip-count">{{ pool.length }}</span>
          </button>
          <button
            v-for="chip in chips"
            :key="chip.key"
            class="chip"
            :class="{ 'is-on': selectedKey === chip.key }"
            @click="selectedKey = chip.key"
          >
            {{ chip.label }}
            <span class="chip-count">{{ chip.count }}</span>
          </button>
        </div>
        <button class="catalog-nav" role="switch" :aria-checked="inStockOnly" @click="inStockOnly = !inStockOnly">
          <span class="chip" :class="{ 'is-on': inStockOnly }">
            {{ t('products.onlyInStock') }}
            <span class="chip-count">{{ stockCount }}</span>
          </span>
        </button>
        <input v-model="searchQuery" type="search" :placeholder="t('products.searchPlaceholder')" class="circus-input w-full max-w-xs bg-white/10">
      </div>
      <div class="mt-4 border-t border-dashed border-white/25 pt-3 text-sm text-circus-muted">
        {{ t('products.showing') }} {{ worksLabel(shown.length) }}
      </div>
    </section>

    <section v-if="status === 'pending' && !products.length" class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
      <div v-for="n in 6" :key="n" class="skeleton-card" />
    </section>

    <section v-else-if="!groups.length" class="paper mt-6 p-8 text-center">
      <h2 class="font-display text-2xl font-bold">{{ t('products.emptyTitle') }}</h2>
      <p class="mt-2 paper-muted">{{ t('products.emptyFilter') }}</p>
    </section>

    <div v-else :key="listKey" class="catalog-pop mt-8 space-y-10">
      <section v-for="group in groups" :key="group.key">
        <header class="mb-4 flex items-end gap-3">
          <h2 class="fandom-tag text-lg">{{ group.label }}</h2>
          <p class="script text-2xl text-[#f3c7cb]">{{ worksLabel(group.items.length) }}</p>
        </header>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div v-for="(product, index) in group.items" :key="product.slug" v-reveal class="reveal" :style="{ '--rd': `${Math.min(index, 8) * 70}ms` }">
            <ProductCard :product="product" @zoom="open(product)" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
