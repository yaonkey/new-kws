<script setup lang="ts">
import {
  getLocalizedField,
  getPriceByLocale,
  getPrimaryProductImage,
  getProductEffectivePrice,
  stockPieceCount,
  isProductAvailable,
  isPatternProduct,
  getPatternPrice,
  hasSalePrice,
  getProductBasePrice,
} from '~/composables/useCatalog'

const { product, close } = useQuickView()
const { t, locale } = useI18n()
const cart = useCart()
const drawer = useCartDrawer()
const route = useRoute()

watch(() => route.fullPath, () => close())

const title = computed(() => product.value ? getLocalizedField(product.value.title, locale.value) : '')
const description = computed(() => product.value ? getLocalizedField(product.value.description, locale.value) : '')
const details = computed(() => {
  const value = product.value?.details
  if (!value) return []
  const text = locale.value === 'en' ? value.en || value.ru || '' : value.ru || ''
  return text.split('\n').map((line) => line.trim()).filter(Boolean)
})
const image = computed(() => product.value ? getPrimaryProductImage(product.value) : '')
const price = computed(() => {
  if (!product.value) return 0
  const value = product.value.is_schema ? getPatternPrice(product.value) : getProductEffectivePrice(product.value)
  return getPriceByLocale(value, locale.value)
})
const basePrice = computed(() => product.value ? getPriceByLocale(getProductBasePrice(product.value), locale.value) : 0)
const onSale = computed(() => Boolean(product.value && !product.value.is_schema && hasSalePrice(product.value)))
const badge = computed(() => {
  if (!product.value || product.value.is_schema) return t('patterns.attachedLabel')
  const count = stockPieceCount(product.value)
  return count != null ? t('products.stock.pieces', { count }) : t('products.stock.out_of_stock')
})

const add = () => {
  if (!product.value) return
  if (product.value.is_schema || !isProductAvailable(product.value)) {
    if (isPatternProduct(product.value)) {
      cart.addPdfItem(product.value)
      close()
      drawer.open()
    }
    return
  }
  cart.addItem(product.value)
  close()
  drawer.open()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="quick-view">
    <div v-if="product" class="quick-view fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-3 sm:items-center" @click.self="close">
      <article class="quick-sheet paper grid max-h-[92vh] w-full max-w-4xl overflow-hidden md:grid-cols-2">
        <div class="quick-photo relative h-72 min-h-0 sm:h-96 md:h-auto md:min-h-[28rem]">
          <img :src="image" :alt="title" class="absolute inset-0 h-full w-full object-cover">
        </div>
        <div class="quick-copy relative space-y-4 overflow-auto p-5 sm:p-7">
          <button class="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#efe6dc]" :aria-label="t('products.close')" @click="close">✕</button>
          <h2 class="pr-10 font-display text-3xl font-bold">{{ title }}</h2>
          <span class="inline-flex rounded-full bg-[#efe6dc] px-3 py-1 text-xs font-semibold">{{ badge }}</span>
          <p v-if="description" class="leading-relaxed paper-muted">{{ description }}</p>
          <ul v-if="details.length" class="space-y-1 text-sm paper-muted">
            <li v-for="line in details" :key="line">· {{ line }}</li>
          </ul>
          <p class="text-2xl font-bold">
            <span v-if="onSale" class="mr-2 text-base font-medium paper-muted line-through">{{ basePrice }}</span>
            {{ price }} {{ t('currency') }}
          </p>
          <button class="circus-btn-primary" @click="add">{{ t('products.addToCart') }}</button>
        </div>
      </article>
    </div>
    </Transition>
  </Teleport>
</template>
