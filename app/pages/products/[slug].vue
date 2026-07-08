<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getCategoryLabel,
  getProductBasePrice,
  getProductEffectivePrice,
  hasSalePrice,
  getPriceByLocale,
  getPrimaryProductImage,
  getProductCategories,
  getProductImages,
  getProductStockStatus,
  canShowPdfAddon,
  isProductAvailable,
  getSchemaAvailability,
  normalizePriceValue,
} from '~/composables/useCatalog'

const route = useRoute()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const cart = useCart()
const drawer = useCartDrawer()

const { fetchCatalog } = useProductsApi()

const { data: catalog, status, refresh } = await useAsyncData(
  () => `products-catalog-item-${locale.value}`,
  fetchCatalog,
  {
    watch: [locale],
    default: () => ({ products: [] }),
  },
)

const product = computed<CatalogProduct | null>(() => {
  const list = catalog.value?.products ?? []
  return list.find((item) => item.slug === String(route.params.slug)) ?? null
})

const productTitle = computed(() => product.value?.title[locale.value as 'ru' | 'en'] ?? '')
const productDescription = computed(() => product.value?.description[locale.value as 'ru' | 'en'] ?? '')
const productDetails = computed(() => {
  if (!product.value?.details) {
    return ''
  }
  if (locale.value === 'ru') {
    return product.value.details.ru || ''
  }
  return product.value.details.en || ''
})
const activeImage = ref('')
const pdfPrice = computed(() => getPriceByLocale(product.value?.pdfPrice ?? { rub: 160, usd: 2 }, locale.value))
const productPrice = computed(() => (product.value ? getPriceByLocale(getProductEffectivePrice(product.value), locale.value) : 0))
const productBasePrice = computed(() => (product.value ? getPriceByLocale(getProductBasePrice(product.value), locale.value) : 0))
const isOnSale = computed(() => (product.value ? hasSalePrice(product.value) : false))
const productLabelCategories = computed(() => {
  if (!product.value) {
    return '—'
  }
  const labels = getProductCategories(product.value).map((category) => getCategoryLabel(category, locale.value))
  return labels.join(', ') || '—'
})
const canBuyProduct = computed(() => Boolean(product.value && isProductAvailable(product.value)))
const stockStatus = computed(() => (product.value ? getProductStockStatus(product.value) : 'unknown'))
const canBuyPdf = computed(() => Boolean(product.value && (product.value.is_schema || canShowPdfAddon(product.value))))
const catalogLink = computed(() => localePath(product.value?.is_schema ? '/patterns' : '/products'))
const catalogLabel = computed(() => (product.value?.is_schema ? t('nav.patterns') : t('nav.products')))
const galleryImages = computed(() => {
  if (!product.value) {
    return []
  }
  return getProductImages(product.value)
})

watch(
  () => [String(route.params.slug), galleryImages.value.join('|')],
  () => {
    activeImage.value = galleryImages.value[0] || ''
  },
  { immediate: true },
)

onMounted(async () => {
  if (galleryImages.value.length <= 1) {
    await refresh()
  }
})

useSeoMeta({
  title: productTitle,
  description: productDescription,
  ogTitle: productTitle,
  ogDescription: productDescription,
  ogType: 'product',
  ogUrl: () => `${config.public.siteUrl}${localePath(`/products/${String(route.params.slug)}`)}`,
  ogImage: () => (product.value ? getPrimaryProductImage(product.value) : '/images/brand-logo-cutout.png'),
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${localePath(`/products/${String(route.params.slug)}`)}` }],
  script: () =>
    product.value
      ? [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: productTitle.value,
              description: productDescription.value,
              image: galleryImages.value,
              sku: product.value.slug,
              offers: {
                '@type': 'Offer',
                priceCurrency: t('currency'),
                price: normalizePriceValue(product.value.price).usd,
                availability: getSchemaAvailability(product.value),
                url: `${config.public.siteUrl}${localePath(`/products/${String(route.params.slug)}`)}`,
              },
            }),
          },
        ]
      : [],
})
</script>

<template>
  <div>
    <nav class="mb-5 text-sm text-circus-muted">
      <NuxtLink :to="localePath('/')" class="hover:text-circus-white">{{ t('nav.home') }}</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink :to="catalogLink" class="hover:text-circus-white">{{ catalogLabel }}</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-circus-text">{{ productTitle }}</span>
    </nav>

    <article v-if="product" class="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <div
          class="mt-3 grid gap-3"
          :class="galleryImages.length > 1 ? 'md:grid-cols-[1fr_110px]' : 'grid-cols-1'"
        >
          <img
            :src="activeImage || getPrimaryProductImage(product)"
            :alt="productTitle"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            class="max-h-[72vh] min-h-[260px] w-full rounded-2xl border border-circus-border object-contain bg-circus-surface"
          >
          <div
            v-if="galleryImages.length > 1"
            class="mt-2 flex gap-2 overflow-x-auto pb-1 md:hidden"
          >
            <button
              v-for="image in galleryImages"
              :key="`mobile-${image}`"
              class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-circus-border bg-circus-surface"
              :class="activeImage === image ? 'border-circus-red shadow-[inset_0_0_0_1px_#cf2d3a]' : ''"
              @click="activeImage = image"
            >
              <img :src="image" :alt="productTitle" loading="lazy" decoding="async" class="h-full w-full object-cover">
            </button>
          </div>
          <div
            v-if="galleryImages.length > 1"
            class="mt-2 hidden max-h-[520px] space-y-2 overflow-y-auto pl-2 pr-1 md:block"
          >
            <button
              v-for="image in galleryImages"
              :key="`desktop-${image}`"
              class="block w-full overflow-hidden rounded-lg border border-circus-border bg-circus-surface"
              :class="activeImage === image ? 'border-circus-red shadow-[inset_0_0_0_1px_#cf2d3a]' : ''"
              @click="activeImage = image"
            >
              <img :src="image" :alt="productTitle" loading="lazy" decoding="async" class="h-20 w-full object-cover">
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <h1 class="circus-heading text-3xl font-bold">{{ productTitle }}</h1>
        <p class="leading-relaxed text-circus-muted">{{ productDescription }}</p>
        <p v-if="isOnSale" class="flex items-baseline gap-3">
          <span class="text-lg font-semibold text-circus-red line-through">{{ productBasePrice }} {{ t('currency') }}</span>
          <span class="text-2xl font-bold text-circus-white">{{ productPrice }} {{ t('currency') }}</span>
        </p>
        <p v-else class="text-2xl font-bold text-circus-white">{{ productPrice }} {{ t('currency') }}</p>
        <p v-if="stockStatus !== 'unknown'" class="text-sm font-medium text-circus-muted">
          {{ t(`products.stock.${stockStatus}`) }}
        </p>

        <section class="rounded-xl border border-circus-border bg-circus-surface p-4 text-sm">
          <h2 class="mb-3 font-semibold text-circus-white">{{ t('products.metaTitle') }}</h2>
          <dl class="space-y-1 text-circus-muted">
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaCategory') }}</dt><dd>{{ productLabelCategories }}</dd></div>
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaSku') }}</dt><dd>{{ product.slug }}</dd></div>
          </dl>
        </section>

        <section
          v-if="productDetails"
          class="rounded-xl border border-circus-border bg-circus-surface p-4 text-sm"
        >
          <h2 class="mb-3 font-semibold text-circus-white">{{ t('products.extraDetailsTitle') }}</h2>
          <p class="whitespace-pre-line leading-relaxed text-circus-muted">{{ productDetails }}</p>
        </section>

        <aside class="sticky top-24 rounded-xl border border-circus-border bg-circus-surface p-4 shadow-circus-glow">
          <button
            v-if="canBuyProduct"
            class="w-full rounded-lg border border-circus-red bg-circus-red px-6 py-3 text-sm font-semibold text-circus-white transition hover:bg-circus-redDeep"
            @click="cart.addItem(product) && drawer.open()"
          >
            {{ t('products.addToCart') }}
          </button>
          <button
            v-if="canBuyPdf"
            class="w-full rounded-lg border border-circus-border bg-circus-bg px-6 py-3 text-sm font-semibold text-circus-text transition hover:border-circus-red"
            :class="canBuyProduct ? 'mt-2' : ''"
            @click="cart.addPdfItem(product); drawer.open()"
          >
            {{ t('products.addPdfToCart') }} ({{ pdfPrice }} {{ t('currency') }})
          </button>
        </aside>
      </div>
    </article>
    <div v-else-if="status === 'pending'" class="rounded-xl border border-circus-border bg-circus-surface p-6 text-sm text-circus-muted">
      {{ t('patterns.loading') }}
    </div>
    <div v-else class="rounded-xl border border-circus-red/60 bg-circus-red/10 p-6 text-sm text-circus-white">
      {{ t('products.notFound') }}
    </div>
  </div>
</template>
