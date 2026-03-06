<script setup lang="ts">
import { getCurrencyByLocale, getPriceByLocale } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isOpen, close } = useCartDrawer()
const { items, totals, incrementItem, decrementItem, removeItem } = useCart()
const { checkoutUrl } = useTelegramCheckout()
const localizedTotal = computed(() => getPriceByLocale(totals.value, locale.value))
const localizedCurrency = computed(() => getCurrencyByLocale(locale.value))
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-stone-900/40"
      aria-label="Close cart drawer"
      @click="close"
    />
  </Transition>

  <aside
    class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-2xl transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex items-center justify-between border-b border-stone-200 px-5 py-4">
      <h2 class="text-lg font-semibold text-stone-900">{{ t('cart.title') }}</h2>
      <button class="rounded border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100" @click="close">✕</button>
    </div>

    <div class="flex-1 overflow-y-auto px-5 py-4">
      <div v-if="!items.length" class="rounded-xl border border-stone-200 bg-stone-50 p-5 text-center text-stone-600">
        {{ t('cart.empty') }}
      </div>
      <div v-else class="space-y-3">
        <article v-for="item in items" :key="item.id" class="rounded-xl border border-stone-200 p-3">
          <div class="flex gap-3">
            <img :src="item.image" :alt="item.title[locale as 'ru' | 'en']" loading="lazy" class="h-16 w-16 rounded object-cover" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-stone-900">{{ item.title[locale as 'ru' | 'en'] }}</p>
              <p v-if="item.kind === 'pdf'" class="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                {{ t('cart.pdfItem') }}
              </p>
              <p class="text-xs text-stone-600">{{ getPriceByLocale(item.price, locale) }} {{ localizedCurrency }}</p>
              <div class="mt-2 flex items-center gap-2">
                <button class="rounded border border-stone-300 px-2 py-0.5 text-xs hover:bg-stone-100" @click="decrementItem(item.id)">-</button>
                <span class="min-w-5 text-center text-xs font-semibold">{{ item.quantity }}</span>
                <button class="rounded border border-stone-300 px-2 py-0.5 text-xs hover:bg-stone-100" @click="incrementItem(item.id)">+</button>
                <button class="ml-auto rounded border border-red-300 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50" @click="removeItem(item.id)">
                  {{ t('cart.remove') }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="border-t border-stone-200 px-5 py-4">
      <p class="text-sm text-stone-500">{{ t('cart.total') }}</p>
      <p class="text-xl font-bold text-stone-900">{{ localizedTotal }} {{ localizedCurrency }}</p>
      <a :href="checkoutUrl" class="mt-3 inline-flex w-full justify-center rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
        {{ t('cart.checkout') }}
      </a>
      <NuxtLink :to="localePath('/cart')" class="mt-2 inline-flex w-full justify-center rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100" @click="close">
        {{ t('nav.cart') }}
      </NuxtLink>
    </div>
  </aside>
</template>
