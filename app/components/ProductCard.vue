<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getProductBasePrice,
  getProductEffectivePrice,
  getPatternPrice,
  hasSalePrice,
  getPriceByLocale,
  getPrimaryProductImage,
  placeholderForProduct,
  stockPieceCount,
  isProductAvailable,
  isPatternProduct,
  getLocalizedField,
} from '~/composables/useCatalog'

const props = defineProps<{
  product: CatalogProduct
  cartMode?: 'product' | 'pdf'
}>()

const emit = defineEmits<{ zoom: [] }>()

const { locale, t } = useI18n()
const cart = useCart()
const { flyToCart } = useCartFx()
const justAdded = ref(false)

const isPdfMode = computed(() => props.cartMode === 'pdf')
const productTitle = computed(() => props.product.title[locale.value as 'ru' | 'en'] || props.product.title.ru)
const note = computed(() => getLocalizedField(props.product.description, locale.value))
const imageFailed = ref(false)
watch(() => props.product.slug, () => { imageFailed.value = false })
const coverImage = computed(() => imageFailed.value ? placeholderForProduct() : getPrimaryProductImage(props.product))
const localizedPrice = computed(() => {
  const price = isPdfMode.value ? getPatternPrice(props.product) : getProductEffectivePrice(props.product)
  return getPriceByLocale(price, locale.value)
})
const localizedBasePrice = computed(() => getPriceByLocale(getProductBasePrice(props.product), locale.value))
const isOnSale = computed(() => !isPdfMode.value && hasSalePrice(props.product))
const canBuyProduct = computed(() => isPdfMode.value ? isPatternProduct(props.product) : isProductAvailable(props.product))
const badge = computed(() => {
  if (isPdfMode.value) {
    return t('patterns.attachedLabel')
  }
  const count = stockPieceCount(props.product)
  if (count != null) return t('products.stock.pieces', { count })
  return t('products.stock.out_of_stock')
})

const handleQuickAdd = (event: MouseEvent) => {
  if (!canBuyProduct.value) {
    return
  }
  const added = isPdfMode.value ? cart.addPdfItem(props.product) : cart.addItem(props.product)
  if (added === false) {
    return
  }
  const card = (event.currentTarget as HTMLElement).closest('article')
  const image = card?.querySelector('img')
  if (image) {
    flyToCart(coverImage.value, image)
  }
  justAdded.value = true
  window.setTimeout(() => {
    justAdded.value = false
  }, 900)
}
</script>

<template>
  <article class="paper card-lift flex h-full cursor-pointer flex-col overflow-hidden" @click="emit('zoom')">
    <div class="card-photo relative">
      <img
        :src="coverImage"
        :alt="productTitle"
        width="640"
        height="640"
          class="aspect-square w-full object-cover"
        @error="imageFailed = true"
      >
      <span class="absolute left-3 top-3 rounded-full border border-circus-cream bg-circus-red px-2.5 py-1 text-[11px] font-semibold text-circus-cream">
        {{ badge }}
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-3 sm:p-4">
      <h3 class="line-clamp-2 text-base font-semibold leading-snug">{{ productTitle }}</h3>
      <p v-if="note" class="line-clamp-2 text-sm paper-muted">{{ note }}</p>
      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <p class="min-w-0">
          <span v-if="isOnSale" class="mr-1 text-xs paper-muted line-through">{{ localizedBasePrice }}</span>
          <span class="text-base font-bold">{{ localizedPrice }} {{ t('currency') }}</span>
        </p>
        <button
          v-if="canBuyProduct"
          class="circus-btn-primary shrink-0 px-3 py-1.5 text-xs"
          @click.stop="handleQuickAdd"
        >
          {{ justAdded ? t('products.added') : t('products.addToCart') }}
        </button>
      </div>
    </div>
  </article>
</template>
