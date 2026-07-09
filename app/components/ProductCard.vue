<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getProductBasePrice,
  getProductEffectivePrice,
  getPatternPrice,
  hasSalePrice,
  getPriceByLocale,
  getPrimaryProductImage,
  getProductImages,
  getProductLabels,
  getProductStockStatus,
  isProductAvailable,
  isPatternProduct,
} from '~/composables/useCatalog'

const props = defineProps<{
  product: CatalogProduct
  cartMode?: 'product' | 'pdf'
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const cart = useCart()

const isPdfMode = computed(() => props.cartMode === 'pdf')
const isAttachedPdf = computed(() => isPdfMode.value && Boolean(props.product.hasPdf) && !props.product.is_schema)
const isLinkable = computed(() => !isAttachedPdf.value)
const showTitle = computed(() => !isAttachedPdf.value)
const showBadges = computed(() => !isPdfMode.value)
const showMultiImage = computed(() => !isPdfMode.value && totalImages.value > 1)
const productTitle = computed(() => props.product.title[locale.value as 'ru' | 'en'] || props.product.title.ru)
const coverImage = computed(() => getPrimaryProductImage(props.product))
const totalImages = computed(() => getProductImages(props.product).length)
const localizedPrice = computed(() => {
  const price = isPdfMode.value ? getPatternPrice(props.product) : getProductEffectivePrice(props.product)
  return getPriceByLocale(price, locale.value)
})
const localizedBasePrice = computed(() => getPriceByLocale(getProductBasePrice(props.product), locale.value))
const isOnSale = computed(() => !isPdfMode.value && hasSalePrice(props.product))
const badges = computed(() => getProductLabels(props.product, locale.value))
const canBuyProduct = computed(() => isPdfMode.value ? isPatternProduct(props.product) : isProductAvailable(props.product))
const stockStatus = computed(() => (isPdfMode.value ? 'unknown' : getProductStockStatus(props.product)))

const handleQuickAdd = () => {
  if (!canBuyProduct.value) {
    return
  }
  if (isPdfMode.value) {
    cart.addPdfItem(props.product)
    return
  }
  cart.addItem(props.product)
}
</script>

<template>
  <article class="group circus-card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:animate-glowPulse">
    <NuxtLink v-if="isLinkable" :to="localePath(`/products/${product.slug}`)" class="block flex-1">
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
          v-if="showMultiImage"
          class="absolute bottom-3 right-3 rounded-full bg-circus-bg/85 px-2.5 py-1 text-xs font-semibold text-circus-white"
        >
          +{{ totalImages - 1 }}
        </span>
        <div v-if="showBadges" class="absolute left-3 top-3 flex flex-wrap gap-1.5">
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
        <h3 v-if="showTitle" class="line-clamp-2 text-base font-semibold text-circus-text md:text-lg">{{ productTitle }}</h3>
        <p v-if="isOnSale" class="flex items-baseline gap-2">
          <span class="text-sm font-semibold text-circus-red line-through">{{ localizedBasePrice }} {{ t('currency') }}</span>
          <span class="text-lg font-bold text-circus-white">{{ localizedPrice }} {{ t('currency') }}</span>
        </p>
        <p v-else class="text-lg font-bold text-circus-white">{{ localizedPrice }} {{ t('currency') }}</p>
        <p v-if="stockStatus !== 'unknown'" class="text-xs text-circus-muted">
          {{ t(`products.stock.${stockStatus}`) }}
        </p>
      </div>
    </NuxtLink>

    <div v-else class="block flex-1">
      <div class="relative overflow-hidden">
        <NuxtImg
          :src="coverImage"
          :alt="productTitle"
          width="640"
          height="640"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          format="webp"
          quality="80"
          class="h-56 w-full object-cover"
        />
      </div>
      <div class="p-4">
        <p class="text-lg font-bold text-circus-white">{{ localizedPrice }} {{ t('currency') }}</p>
      </div>
    </div>

    <div class="mt-auto px-4 pb-4">
      <button
        v-if="canBuyProduct"
        class="w-full rounded-lg border border-circus-border bg-circus-surfaceSoft px-3 py-2 text-sm font-semibold text-circus-text transition hover:border-circus-red hover:bg-circus-red hover:text-circus-white"
        @click="handleQuickAdd"
      >
        {{ t('products.addToCart') }}
      </button>
    </div>
  </article>
</template>
