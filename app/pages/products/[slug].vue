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
  getPatternPrice,
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
const { flyToCart } = useCartFx()
const justAdded = ref(false)

const flyFromGallery = () => {
  const image = document.querySelector<HTMLElement>('[data-cart-source]')
  const current = product.value
  if (!image || !current) {
    return
  }
  flyToCart(activeImage.value || getPrimaryProductImage(current), image)
}

const addProduct = () => {
  if (!product.value || cart.addItem(product.value) === false) {
    return
  }
  flyFromGallery()
  justAdded.value = true
  window.setTimeout(() => {
    justAdded.value = false
  }, 900)
  drawer.open()
}

const addPdf = () => {
  if (!product.value) {
    return
  }
  cart.addPdfItem(product.value)
  flyFromGallery()
  drawer.open()
}

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
const pdfPrice = computed(() => {
  if (!product.value) return 0
  const value = product.value.is_schema ? getPatternPrice(product.value) : (product.value.pdfPrice ?? { rub: 160, usd: 2 })
  return getPriceByLocale(value, locale.value)
})
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
                priceCurrency: locale.value === 'ru' ? 'RUB' : 'USD',
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
      <NuxtLink :to="localePath('/')" class="hover:text-white">{{ t('nav.home') }}</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink :to="catalogLink" class="hover:text-white">{{ catalogLabel }}</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-white">{{ productTitle }}</span>
    </nav>

    <article v-if="product" class="paper grid items-start overflow-hidden md:grid-cols-[1.05fr_0.95fr]">
      <div class="bg-[#efe6dc] p-3">
        <div
          class="grid gap-3"
          :class="galleryImages.length > 1 ? 'md:grid-cols-[1fr_110px]' : 'grid-cols-1'"
        >
          <img
            data-cart-source
            :src="activeImage || getPrimaryProductImage(product)"
            :alt="productTitle"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            class="max-h-[72vh] min-h-[260px] w-full rounded-2xl object-contain"
          >
          <div
            v-if="galleryImages.length > 1"
            class="mt-2 flex gap-2 overflow-x-auto pb-1 md:hidden"
          >
            <button
              v-for="image in galleryImages"
              :key="`mobile-${image}`"
              class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white"
              :class="activeImage === image ? 'ring-2 ring-circus-red' : ''"
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
              class="block w-full overflow-hidden rounded-lg bg-white"
              :class="activeImage === image ? 'ring-2 ring-circus-red' : ''"
              @click="activeImage = image"
            >
              <img :src="image" :alt="productTitle" loading="lazy" decoding="async" class="h-20 w-full object-cover">
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-5 p-5 sm:p-7">
        <h1 class="font-display text-4xl font-bold">{{ productTitle }}</h1>
        <p class="leading-relaxed paper-muted">{{ productDescription }}</p>
        <p v-if="isOnSale" class="flex items-baseline gap-3">
          <span class="text-lg paper-muted line-through">{{ productBasePrice }} {{ t('currency') }}</span>
          <span class="text-2xl font-bold text-circus-red">{{ productPrice }} {{ t('currency') }}</span>
        </p>
        <p v-else class="text-2xl font-bold">{{ productPrice }} {{ t('currency') }}</p>
        <p v-if="stockStatus !== 'unknown'" class="text-sm font-medium paper-muted">
          {{ t(`products.stock.${stockStatus}`) }}
        </p>

        <section class="rounded-2xl bg-white/70 p-4 text-sm">
          <h2 class="mb-3 font-semibold">{{ t('products.metaTitle') }}</h2>
          <dl class="space-y-1 paper-muted">
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaCategory') }}</dt><dd>{{ productLabelCategories }}</dd></div>
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaSku') }}</dt><dd>{{ product.slug }}</dd></div>
          </dl>
        </section>

        <section
          v-if="productDetails"
          class="rounded-2xl bg-white/70 p-4 text-sm"
        >
          <h2 class="mb-3 font-semibold">{{ t('products.extraDetailsTitle') }}</h2>
          <p class="whitespace-pre-line leading-relaxed paper-muted">{{ productDetails }}</p>
        </section>

        <aside class="sticky top-36 rounded-2xl bg-white/80 p-4">
          <button
            v-if="canBuyProduct"
            class="circus-btn-primary w-full"
            :class="justAdded ? 'scale-95' : ''"
            @click="addProduct"
          >
            {{ justAdded ? t('products.added') : t('products.addToCart') }}
          </button>
          <button
            v-if="canBuyPdf"
            class="circus-btn-secondary w-full"
            :class="canBuyProduct ? 'mt-2' : ''"
            @click="addPdf"
          >
            {{ t('products.addPdfToCart') }} ({{ pdfPrice }} {{ t('currency') }})
          </button>
        </aside>
      </div>
    </article>
    <div v-else-if="status === 'pending'" class="skeleton-card" />
    <div v-else class="paper p-6 text-sm">
      {{ t('products.notFound') }}
    </div>
  </div>
</template>
