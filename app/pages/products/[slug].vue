<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getCategoryLabel,
  getPriceByLocale,
  getPrimaryProductImage,
  getProductCategory,
  getProductImages,
  normalizePriceValue,
} from '~/composables/useCatalog'

const route = useRoute()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const cart = useCart()
const drawer = useCartDrawer()

const { data: catalog } = await useAsyncData('products-catalog-item', () => queryCollection('products').first())

const product = computed<CatalogProduct | null>(() => {
  const list = catalog.value?.products ?? []
  return list.find((item) => item.slug === String(route.params.slug)) ?? null
})

const productTitle = computed(() => product.value?.title[locale.value as 'ru' | 'en'] ?? '')
const productDescription = computed(() => product.value?.description[locale.value as 'ru' | 'en'] ?? '')
const activeImage = ref('')
const pdfPrice = computed(() => getPriceByLocale(product.value?.pdfPrice ?? { rub: 110, usd: 2 }, locale.value))
const productPrice = computed(() => (product.value ? getPriceByLocale(product.value.price, locale.value) : 0))
const productCategory = computed(() => (product.value ? getProductCategory(product.value) : ''))
const productCategoryLabel = computed(() => getCategoryLabel(productCategory.value, locale.value))
const galleryImages = computed(() => {
  if (!product.value) {
    return []
  }
  return getProductImages(product.value)
})

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: t('products.notFound') })
}

if (!activeImage.value) {
  activeImage.value = galleryImages.value[0]
}

useSeoMeta({
  title: productTitle,
  description: productDescription,
  ogTitle: productTitle,
  ogDescription: productDescription,
  ogType: 'product',
  ogUrl: `${config.public.siteUrl}${localePath(`/products/${String(route.params.slug)}`)}`,
  ogImage: getPrimaryProductImage(product.value),
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${localePath(`/products/${String(route.params.slug)}`)}` }],
  script: [
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
          availability: 'https://schema.org/InStock',
          url: `${config.public.siteUrl}${localePath(`/products/${String(route.params.slug)}`)}`,
        },
      }),
    },
  ],
})
</script>

<template>
  <div>
    <nav class="mb-5 text-sm text-stone-500">
      <NuxtLink :to="localePath('/')" class="hover:text-emerald-700">{{ t('nav.home') }}</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink :to="localePath('/products')" class="hover:text-emerald-700">{{ t('nav.products') }}</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-stone-700">{{ productTitle }}</span>
    </nav>

    <article class="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <div
          class="mt-3 grid gap-3"
          :class="galleryImages.length > 1 ? 'md:grid-cols-[1fr_110px]' : 'grid-cols-1'"
        >
          <img
            :src="activeImage || getPrimaryProductImage(product!)"
            :alt="productTitle"
            loading="lazy"
            class="h-[420px] w-full rounded-2xl border border-stone-200 object-cover bg-white md:h-[520px]"
          />
          <div
            v-if="galleryImages.length > 1"
            class="mt-2 max-h-[520px] space-y-2 overflow-y-auto pl-2 pr-1"
          >
            <button
              v-for="image in galleryImages"
              :key="image"
              class="block w-full overflow-hidden rounded-lg border border-stone-200 bg-white"
              :class="activeImage === image ? 'border-emerald-600 shadow-[inset_0_0_0_1px_#059669]' : ''"
              @click="activeImage = image"
            >
              <img :src="image" :alt="productTitle" loading="lazy" class="h-20 w-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <h1 class="text-3xl font-bold text-stone-900">{{ productTitle }}</h1>
        <p class="leading-relaxed text-stone-700">{{ productDescription }}</p>
        <p class="text-2xl font-bold text-emerald-700">{{ productPrice }} {{ t('currency') }}</p>

        <section class="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
          <h2 class="mb-3 font-semibold text-stone-900">{{ t('products.metaTitle') }}</h2>
          <dl class="space-y-1 text-stone-700">
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaCategory') }}</dt><dd>{{ productCategoryLabel }}</dd></div>
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaSku') }}</dt><dd>{{ product!.slug }}</dd></div>
            <div class="flex justify-between gap-2"><dt>{{ t('products.metaPdf') }}</dt><dd>{{ product?.hasPdf ? 'Yes' : 'No' }}</dd></div>
          </dl>
        </section>

        <aside class="sticky top-24 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p v-if="product?.hasPdf" class="mb-2 text-sm text-stone-500">
            {{ t('products.pdfAvailable') }}
          </p>
          <button
            class="w-full rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            @click="cart.addItem(product!); drawer.open()"
          >
            {{ t('products.addToCart') }}
          </button>
          <button
            v-if="product?.hasPdf"
            class="mt-2 w-full rounded-lg border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            @click="cart.addPdfItem(product!); drawer.open()"
          >
            {{ t('products.addPdfToCart') }} ({{ pdfPrice }} {{ t('currency') }})
          </button>
        </aside>
      </div>
    </article>
  </div>
</template>
