<script setup lang="ts">
import { getCurrencyByLocale, getPriceByLocale } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
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

useSeoMeta({
  title: t('seo.cartTitle'),
  description: t('cart.title'),
})
</script>

<template>
  <div>
    <section class="mb-6">
      <h1 class="circus-heading text-3xl font-bold">{{ t('cart.title') }}</h1>
    </section>

    <section v-if="!items.length" class="circus-card p-8 text-center">
      <p class="text-circus-muted">{{ t('cart.empty') }}</p>
      <NuxtLink :to="localePath('/products')" class="circus-btn-primary mt-4">
        {{ t('cart.continueShopping') }}
      </NuxtLink>
    </section>

    <section v-else class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-4">
        <article
          v-for="item in items"
          :key="item.id"
          class="circus-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-4">
            <NuxtImg :src="item.image" :alt="item.title[locale as 'ru' | 'en']" width="160" height="160" sizes="80px" format="webp" class="h-20 w-20 rounded-lg object-cover" />
            <div>
              <h2 class="font-semibold text-circus-text">{{ item.title[locale as 'ru' | 'en'] }}</h2>
              <p v-if="item.kind === 'pdf'" class="text-xs font-semibold uppercase tracking-wide text-circus-red">
                {{ t('cart.pdfItem') }}
              </p>
              <p class="text-sm text-circus-muted">{{ getPriceByLocale(item.price, locale) }} {{ localizedCurrency }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="rounded border border-circus-border bg-circus-surfaceSoft px-3 py-1 text-sm hover:border-circus-red"
              :aria-label="t('cart.decrease')"
              @click="decrementItem(item.id)"
            >
              -
            </button>
            <span class="min-w-8 text-center text-sm font-semibold">{{ item.quantity }}</span>
            <button
              class="rounded border border-circus-border bg-circus-surfaceSoft px-3 py-1 text-sm hover:border-circus-red"
              :aria-label="t('products.addToCart')"
              @click="incrementItem(item.id)"
            >
              +
            </button>
            <button
              class="ml-2 rounded border border-circus-red/50 px-3 py-1 text-sm text-circus-red hover:bg-circus-red/10"
              @click="removeItem(item.id)"
            >
              {{ t('cart.remove') }}
            </button>
          </div>
        </article>
      </div>

      <aside class="circus-card h-fit p-5">
        <p class="text-sm text-circus-muted">{{ t('cart.total') }}</p>
        <p class="mt-1 text-2xl font-bold text-circus-white">{{ localizedTotal }} {{ localizedCurrency }}</p>
        <button
          class="circus-btn-primary mt-4 w-full cursor-pointer"
          @click="openCheckout"
        >
          {{ t('cart.checkout') }}
        </button>
        <button
          class="mt-2 inline-flex w-full cursor-pointer justify-center rounded-lg border border-circus-red/50 px-5 py-3 text-sm font-semibold text-circus-red hover:bg-circus-red/10"
          @click="handleClearCart"
        >
          {{ t('cart.clear') }}
        </button>
      </aside>
    </section>
  </div>
</template>
