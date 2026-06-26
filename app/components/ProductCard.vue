<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getProductBasePrice,
  getProductEffectivePrice,
  hasSalePrice,
  getPriceByLocale,
  getPrimaryProductImage,
  getProductImages,
  getProductLabels,
} from '~/composables/useCatalog'

const props = defineProps<{
  product: CatalogProduct
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const cart = useCart()

const productTitle = computed(() => props.product.title[locale.value as 'ru' | 'en'] || props.product.title.ru)
const coverImage = computed(() => getPrimaryProductImage(props.product))
const totalImages = computed(() => getProductImages(props.product).length)
const localizedPrice = computed(() => getPriceByLocale(getProductEffectivePrice(props.product), locale.value))
const localizedBasePrice = computed(() => getPriceByLocale(getProductBasePrice(props.product), locale.value))
const isOnSale = computed(() => hasSalePrice(props.product))
const badges = computed(() => getProductLabels(props.product, locale.value))
const canBuyProduct = computed(() => !props.product.is_schema)
const canBuyPdf = computed(() => Boolean(props.product.hasPdf || props.product.is_schema))

const handleQuickAdd = () => {
  if (canBuyProduct.value) {
    cart.addItem(props.product)
    return
  }
  if (canBuyPdf.value) {
    cart.addPdfItem(props.product)
  }
}
</script>

<template>
  <article class="group circus-card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:animate-glowPulse">
    <NuxtLink :to="localePath(`/products/${product.slug}`)" class="block flex-1">
      <div class="relative overflow-hidden">
        <NuxtImg
          :src="coverImage"
          :alt="productTitle"
          width="640"
          height="640"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          format="webp"
          quality="80"
          class="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          v-if="totalImages > 1"
          class="absolute bottom-3 right-3 rounded-full bg-circus-bg/85 px-2.5 py-1 text-xs font-semibold text-circus-white"
        >
          +{{ totalImages - 1 }}
        </span>
        <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            v-for="badge in badges"
            :key="badge"
            class="rounded-full border border-circus-red bg-circus-red/90 px-3 py-1 text-xs font-semibold text-circus-white"
          >
            {{ badge }}
          </span>
        </div>
      </div>
      <div class="space-y-3 p-4">
        <h3 class="line-clamp-2 text-base font-semibold text-circus-text md:text-lg">{{ productTitle }}</h3>
        <p v-if="isOnSale" class="flex items-baseline gap-2">
          <span class="text-sm font-semibold text-circus-red line-through">{{ localizedBasePrice }} {{ t('currency') }}</span>
          <span class="text-lg font-bold text-circus-white">{{ localizedPrice }} {{ t('currency') }}</span>
        </p>
        <p v-else class="text-lg font-bold text-circus-white">{{ localizedPrice }} {{ t('currency') }}</p>
      </div>
    </NuxtLink>
    <div class="mt-auto px-4 pb-4">
      <button
        v-if="canBuyProduct || canBuyPdf"
        class="w-full rounded-lg border border-circus-border bg-circus-surfaceSoft px-3 py-2 text-sm font-semibold text-circus-text transition hover:border-circus-red hover:bg-circus-red hover:text-circus-white"
        @click="handleQuickAdd"
      >
        {{ canBuyProduct ? t('products.addToCart') : t('products.addPdfToCart') }}
      </button>
    </div>
  </article>
</template>
