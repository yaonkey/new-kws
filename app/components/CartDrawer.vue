<script setup lang="ts">
import { getCurrencyByLocale, getPriceByLocale, resolveProductImageUrl } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isOpen, close } = useCartDrawer()
const { items, totals, incrementItem, decrementItem, removeItem, clearCart } = useCart()
const { openCheckout } = useTelegramCheckout()
const localizedTotal = computed(() => getPriceByLocale(totals.value, locale.value))
const localizedCurrency = computed(() => getCurrencyByLocale(locale.value))
const motionKey = ref(0)

watch(isOpen, (open) => {
  if (open) motionKey.value += 1
})

const handleClearCart = () => {
  const confirmed = window.confirm(t('cart.clearConfirm'))
  if (!confirmed) return
  clearCart()
}
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isOpen"
      class="fixed inset-0 z-[45] bg-black/80"
      :aria-label="t('products.close')"
      @click="close"
    />
  </Transition>

  <aside
    class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#14110f] text-[#f4eadf] shadow-2xl transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex items-center justify-between px-5 py-4">
      <h2 class="font-display text-2xl font-bold">{{ t('cart.title') }}</h2>
      <button class="grid h-9 w-9 place-items-center rounded-full border border-[#ead9c8]/40 text-[#f4eadf]" @click="close">✕</button>
    </div>

    <div :key="motionKey" class="flex-1 overflow-y-auto px-5 pb-4">
      <div v-if="!items.length" class="rounded-2xl bg-[#1e1916] p-5 text-center text-[#cbb6a6]">
        {{ t('cart.empty') }}
      </div>
      <div v-else class="space-y-3">
        <article
          v-for="(item, index) in items"
          :key="item.id"
          class="cart-row flex gap-3 rounded-2xl bg-[#1e1916] p-3"
          :style="{ '--rd': `${index * 60}ms` }"
        >
          <img
            :src="resolveProductImageUrl(item.image)"
            :alt="item.title[locale as 'ru' | 'en']"
            width="72"
            height="72"
            class="h-16 w-16 rounded-xl object-cover"
          >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ item.title[locale as 'ru' | 'en'] }}</p>
            <p v-if="item.kind === 'pdf'" class="text-[11px] font-semibold uppercase tracking-wide text-circus-red">{{ t('cart.pdfItem') }}</p>
            <p class="text-xs text-[#cbb6a6]">{{ getPriceByLocale(item.price, locale) }} {{ localizedCurrency }}</p>
            <div class="mt-2 flex items-center gap-2">
              <button class="grid h-7 w-7 place-items-center rounded-full border border-[#ead9c8]/40" @click="decrementItem(item.id)">-</button>
              <span class="min-w-5 text-center text-sm font-semibold">{{ item.quantity }}</span>
              <button class="grid h-7 w-7 place-items-center rounded-full border border-[#ead9c8]/40" @click="incrementItem(item.id)">+</button>
              <button class="ml-auto text-xs text-circus-red" @click="removeItem(item.id)">{{ t('cart.remove') }}</button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="isOpen" class="cart-foot border-t border-[#ead9c8]/20 px-5 py-4">
      <template v-if="items.length">
        <p class="text-sm text-[#cbb6a6]">{{ t('cart.total') }}</p>
        <p class="text-2xl font-bold">{{ localizedTotal }} {{ localizedCurrency }}</p>
        <button class="circus-btn-primary mt-3 w-full" @click="openCheckout">{{ t('cart.checkout') }}</button>
        <button class="mt-2 w-full text-sm text-circus-red" @click="handleClearCart">{{ t('cart.clear') }}</button>
      </template>
      <NuxtLink v-else :to="localePath('/products')" class="circus-btn-primary w-full" @click="close">
        {{ t('cart.continueShopping') }}
      </NuxtLink>
    </div>
  </aside>
</template>
