<script setup lang="ts">
import { getCurrencyByLocale, getPriceByLocale } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isOpen, close } = useCartDrawer()
const { items, totals, incrementItem, decrementItem, removeItem, clearCart } = useCart()
const { openCheckout } = useTelegramCheckout()
const localizedTotal = computed(() => getPriceByLocale(totals.value, locale.value))
const localizedCurrency = computed(() => getCurrencyByLocale(locale.value))

const handleClearCart = () => {
  const confirmed = window.confirm(t('cart.clearConfirm'))
  if (!confirmed) {
    return
  }
  clearCart()
}
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/70"
      aria-label="Close cart drawer"
      @click="close"
    />
  </Transition>

  <aside
    class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-circus-border bg-circus-surface shadow-2xl transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex items-center justify-between border-b border-circus-border px-5 py-4">
      <h2 class="text-lg font-semibold text-circus-white">{{ t('cart.title') }}</h2>
      <button class="rounded border border-circus-border bg-circus-bg px-3 py-1 text-sm text-circus-muted hover:border-circus-red hover:text-circus-white" @click="close">✕</button>
    </div>

    <div class="flex-1 overflow-y-auto px-5 py-4">
      <div v-if="!items.length" class="rounded-xl border border-circus-border bg-circus-bg p-5 text-center text-circus-muted">
        {{ t('cart.empty') }}
      </div>
      <div v-else class="space-y-3">
        <article v-for="item in items" :key="item.id" class="rounded-xl border border-circus-border bg-circus-bg p-3">
          <div class="flex gap-3">
            <NuxtImg :src="item.image" :alt="item.title[locale as 'ru' | 'en']" width="128" height="128" sizes="64px" format="webp" class="h-16 w-16 rounded object-cover" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-circus-white">{{ item.title[locale as 'ru' | 'en'] }}</p>
              <p v-if="item.kind === 'pdf'" class="text-[11px] font-semibold uppercase tracking-wide text-circus-red">
                {{ t('cart.pdfItem') }}
              </p>
              <p class="text-xs text-circus-muted">{{ getPriceByLocale(item.price, locale) }} {{ localizedCurrency }}</p>
              <div class="mt-2 flex items-center gap-2">
                <button class="rounded border border-circus-border px-2 py-0.5 text-xs hover:border-circus-red" @click="decrementItem(item.id)">-</button>
                <span class="min-w-5 text-center text-xs font-semibold">{{ item.quantity }}</span>
                <button class="rounded border border-circus-border px-2 py-0.5 text-xs hover:border-circus-red" @click="incrementItem(item.id)">+</button>
                <button class="ml-auto rounded border border-circus-red/50 px-2 py-0.5 text-xs text-circus-red hover:bg-circus-red/10" @click="removeItem(item.id)">
                  {{ t('cart.remove') }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="border-t border-circus-border px-5 py-4">
      <p class="text-sm text-circus-muted">{{ t('cart.total') }}</p>
      <p class="text-xl font-bold text-circus-white">{{ localizedTotal }} {{ localizedCurrency }}</p>
      <button
        class="circus-btn-primary mt-3 w-full cursor-pointer"
        @click="openCheckout"
      >
        {{ t('cart.checkout') }}
      </button>
      <button
        class="mt-2 inline-flex w-full cursor-pointer justify-center rounded-lg border border-circus-red/50 px-4 py-3 text-sm font-semibold text-circus-red hover:bg-circus-red/10"
        @click="handleClearCart"
      >
        {{ t('cart.clear') }}
      </button>
      <NuxtLink :to="localePath('/cart')" class="mt-2 inline-flex w-full justify-center rounded-lg border border-circus-border px-4 py-3 text-sm font-semibold text-circus-text hover:border-circus-red" @click="close">
        {{ t('nav.cart') }}
      </NuxtLink>
    </div>
  </aside>
</template>
