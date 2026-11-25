<script setup lang="ts">
import { getCurrencyByLocale, getPriceByLocale, resolveProductImageUrl } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { items, totals, incrementItem, decrementItem, removeItem, clearCart } = useCart()
const { openCheckout } = useTelegramCheckout()
const localizedTotal = computed(() => getPriceByLocale(totals.value, locale.value))
const localizedCurrency = computed(() => getCurrencyByLocale(locale.value))

const handleClearCart = () => {
  if (!window.confirm(t('cart.clearConfirm'))) return
  clearCart()
}

useSeoMeta({
  title: t('seo.cartTitle'),
  description: t('cart.title'),
})
</script>

<template>
  <div>
    <h1 class="circus-heading text-5xl font-bold">{{ t('cart.title') }}</h1>

    <section v-if="!items.length" class="paper mt-6 p-8 text-center">
      <p class="paper-muted">{{ t('cart.empty') }}</p>
      <NuxtLink :to="localePath('/products')" class="circus-btn-primary mt-4">{{ t('cart.continueShopping') }}</NuxtLink>
    </section>

    <section v-else class="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
      <div class="space-y-3">
        <article v-for="(item, index) in items" :key="item.id" v-reveal class="paper reveal flex flex-col gap-4 p-4 sm:flex-row sm:items-center" :style="{ '--rd': `${index * 60}ms` }">
          <img :src="resolveProductImageUrl(item.image)" :alt="item.title[locale as 'ru' | 'en']" width="80" height="80" class="h-20 w-20 rounded-xl object-cover">
          <div class="min-w-0 flex-1">
            <h2 class="font-semibold">{{ item.title[locale as 'ru' | 'en'] }}</h2>
            <p v-if="item.kind === 'pdf'" class="text-xs font-semibold uppercase text-circus-red">{{ t('cart.pdfItem') }}</p>
            <p class="text-sm paper-muted">{{ getPriceByLocale(item.price, locale) }} {{ localizedCurrency }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="grid h-8 w-8 place-items-center rounded-full bg-[#efe6dc]" @click="decrementItem(item.id)">-</button>
            <span class="min-w-6 text-center font-semibold">{{ item.quantity }}</span>
            <button class="grid h-8 w-8 place-items-center rounded-full bg-[#efe6dc]" @click="incrementItem(item.id)">+</button>
            <button class="ml-2 text-sm text-circus-red" @click="removeItem(item.id)">{{ t('cart.remove') }}</button>
          </div>
        </article>
      </div>
      <aside class="paper h-fit p-5">
        <p class="text-sm paper-muted">{{ t('cart.total') }}</p>
        <p class="mt-1 text-3xl font-bold">{{ localizedTotal }} {{ localizedCurrency }}</p>
        <button class="circus-btn-primary mt-4 w-full" @click="openCheckout">{{ t('cart.checkout') }}</button>
        <button class="mt-3 w-full text-sm text-circus-red" @click="handleClearCart">{{ t('cart.clear') }}</button>
      </aside>
    </section>
  </div>
</template>
