<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import {
  getCategoryLabel,
  getPriceByLocale,
  getPrimaryProductImage,
  getProductCategories,
  getProductImages,
  getProductLabels,
} from '~/composables/useCatalog'

const props = defineProps<{
  product: CatalogProduct
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const cart = useCart()
const currentLocale = computed(() => locale.value || 'ru')

const productTitle = computed(() => props.product.title[locale.value as 'ru' | 'en'] || props.product.title.ru)
const coverImage = computed(() => getPrimaryProductImage(props.product))
const totalImages = computed(() => getProductImages(props.product).length)
const localizedPrice = computed(() => getPriceByLocale(props.product.price, locale.value))
const badges = computed(() => getProductLabels(props.product, locale.value))
const categoryLabels = computed(() =>
  getProductCategories(props.product).map((category) => getCategoryLabel(category ?? 'other', currentLocale.value ?? 'ru')),
)
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
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
    <NuxtLink :to="localePath(`/products/${product.slug}`)" class="block flex-1">
      <div class="relative overflow-hidden">
        <img
          :src="coverImage"
          :alt="productTitle"
          loading="lazy"
          class="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          v-if="totalImages > 1"
          class="absolute bottom-3 right-3 rounded-full bg-stone-900/75 px-2.5 py-1 text-xs font-semibold text-white"
        >
          +{{ totalImages - 1 }}
        </span>
        <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            v-for="badge in badges"
            :key="badge"
            class="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white"
          >
            {{ badge }}
          </span>
        </div>
      </div>
      <div class="space-y-3 p-4">
        <h3 class="line-clamp-2 text-base font-semibold text-stone-900 md:text-lg">{{ productTitle }}</h3>
        <p class="line-clamp-1 text-xs text-stone-500">{{ categoryLabels.join(', ') }}</p>
        <p class="text-lg font-bold text-emerald-700">{{ localizedPrice }} {{ t('currency') }}</p>
      </div>
    </NuxtLink>
    <div class="mt-auto px-4 pb-4">
      <button
        v-if="canBuyProduct || canBuyPdf"
        class="w-full rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-700 hover:text-white"
        @click="handleQuickAdd"
      >
        {{ canBuyProduct ? t('products.addToCart') : t('products.addPdfToCart') }}
      </button>
    </div>
  </article>
</template>
