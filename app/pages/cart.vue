<script setup lang="ts">
import { getCurrencyByLocale, getPriceByLocale } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { items, totals, incrementItem, decrementItem, removeItem } = useCart()
const { checkoutUrl } = useTelegramCheckout()
const localizedTotal = computed(() => getPriceByLocale(totals.value, locale.value))
const localizedCurrency = computed(() => getCurrencyByLocale(locale.value))

useSeoMeta({
  title: t('seo.cartTitle'),
  description: t('cart.title'),
})
</script>

<template>
  <div>
    <section class="mb-6">
      <h1 class="text-3xl font-bold text-stone-900">{{ t('cart.title') }}</h1>
    </section>

    <section v-if="!items.length" class="rounded-xl border border-stone-200 bg-white p-8 text-center">
      <p class="text-stone-600">{{ t('cart.empty') }}</p>
      <NuxtLink :to="localePath('/products')" class="mt-4 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
        {{ t('cart.continueShopping') }}
      </NuxtLink>
    </section>

    <section v-else class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-4">
        <article
          v-for="item in items"
          :key="item.id"
          class="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-4">
            <img :src="item.image" :alt="item.title[locale as 'ru' | 'en']" class="h-20 w-20 rounded-lg object-cover" />
            <div>
              <h2 class="font-semibold text-stone-900">{{ item.title[locale as 'ru' | 'en'] }}</h2>
              <p v-if="item.kind === 'pdf'" class="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {{ t('cart.pdfItem') }}
              </p>
              <p class="text-sm text-stone-600">{{ getPriceByLocale(item.price, locale) }} {{ localizedCurrency }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="rounded border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100"
              :aria-label="t('cart.decrease')"
              @click="decrementItem(item.id)"
            >
              -
            </button>
            <span class="min-w-8 text-center text-sm font-semibold">{{ item.quantity }}</span>
            <button
              class="rounded border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100"
              :aria-label="t('products.addToCart')"
              @click="incrementItem(item.id)"
            >
              +
            </button>
            <button
              class="ml-2 rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              @click="removeItem(item.id)"
            >
              {{ t('cart.remove') }}
            </button>
          </div>
        </article>
      </div>

      <aside class="h-fit rounded-xl border border-stone-200 bg-white p-5">
        <p class="text-sm text-stone-500">{{ t('cart.total') }}</p>
        <p class="mt-1 text-2xl font-bold text-stone-900">{{ localizedTotal }} {{ localizedCurrency }}</p>
        <a
          :href="checkoutUrl"
          class="mt-4 inline-flex w-full justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          {{ t('cart.checkout') }}
        </a>
      </aside>
    </section>
  </div>
</template>
