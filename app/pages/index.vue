<script setup lang="ts">
import type { CatalogProduct } from '~/composables/useCart'
import { getLocalizedField, getPriceByLocale, getPrimaryProductImage, getProductEffectivePrice, getProductStockStatus, hasProductLabel, stockPieceCount } from '~/composables/useCatalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const { open } = useQuickView()

const { fetchUpcomingMarket, formatMarketPeriod } = useMarketsApi()
const { fetchShelves } = useShelvesApi()
const { fetchCatalog } = useProductsApi()

const { data: upcomingMarket, refresh: refreshMarket } = await useAsyncData('upcoming-market', fetchUpcomingMarket, { default: () => null })
const { data: shelves } = await useAsyncData('public-shelves', fetchShelves, { default: () => [] })
const { data: catalog } = await useAsyncData(() => `home-catalog-${locale.value}`, fetchCatalog, {
  watch: [locale],
  default: () => ({ products: [] }),
})

const goods = computed(() => (catalog.value?.products ?? []).filter((product) => !product.is_schema))
const inStock = (product: CatalogProduct) => getProductStockStatus(product) !== 'out_of_stock'
const stockGoods = computed(() => goods.value.filter(inStock))
const featured = computed(() => goods.value.find((product) => hasProductLabel(product, 'new') && inStock(product)) || stockGoods.value[0] || goods.value[0] || null)
const featuredTitle = computed(() => featured.value ? getLocalizedField(featured.value.title, locale.value) : '')
const featuredPrice = computed(() => featured.value ? getPriceByLocale(getProductEffectivePrice(featured.value), locale.value) : 0)
const featuredImage = computed(() => featured.value ? getPrimaryProductImage(featured.value) : '')
const featuredStock = computed(() => {
  if (!featured.value) return ''
  const count = stockPieceCount(featured.value)
  return count != null ? t('products.stock.pieces', { count }) : t('products.stock.out_of_stock')
})
const marketPeriod = computed(() => upcomingMarket.value ? formatMarketPeriod(upcomingMarket.value, locale.value) : '')
const isRu = computed(() => locale.value === 'ru')

const services = computed(() => isRu.value
  ? ['Написание схем игрушек', 'Создание уникальных игрушек под запрос', 'Разработка новых коллекций к сезону', 'Изделия не только для детей: схемы, аксессуары и декор']
  : ['Pattern writing for handmade toys', 'Custom toy creation based on your request', 'New seasonal product design', 'Not only toys: patterns, accessories, and decor'])

const deliveryItems = computed(() => isRu.value
  ? ['Москва: доставка к метро от 100 до 350 руб', 'Самовывоз: пос. Рублево, ул. Новорублевская, д. 2', 'По России: Почта России, Озон Доставка или Яндекс Доставка']
  : ['Moscow: metro delivery from 100 to 350 RUB', 'Pickup: Rublyovo, Novorublevskaya 2', 'Russia-wide shipping via Russian Post, Ozon Delivery or Yandex Delivery'])

const socialLinks = [
  { key: 'vk', href: 'https://vk.com/kofworkshop' },
  { key: 'telegram', href: 'https://t.me/kofworkshop' },
  { key: 'instagram', href: 'https://instagram.com/kofworkshop' },
  { key: 'reddit', href: 'https://www.reddit.com/r/kofworkshop/' },
  { key: 'boosty', href: 'https://boosty.to/kofonkina' },
  { key: 'pinterest', href: 'https://www.pinterest.com/kofworkshop/' },
  { key: 'flowwow', href: 'https://flowwow.com/shop/kofworkshop/' },
  { key: 'twitch', href: 'https://twitch.tv/bakasempaides' },
  { key: 'pikabu', href: 'https://pikabu.ru/@megawhat' },
] as const

const cart = useCart()
const { flyToCart } = useCartFx()
const addFeatured = (event: MouseEvent) => {
  if (!featured.value) return
  cart.addItem(featured.value)
  const image = (event.currentTarget as HTMLElement).closest('article')?.querySelector('img')
  if (image) flyToCart(featuredImage.value, image)
}

useSeoMeta({
  title: t('seo.homeTitle'),
  description: t('home.subtitle'),
  ogTitle: `Kofworkshop - ${t('seo.homeTitle')}`,
  ogDescription: t('home.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/')}`,
})

onMounted(() => {
  refreshMarket()
})
</script>

<template>
  <div>
    <section class="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
      <div v-reveal class="reveal">
        <p class="text-xs uppercase tracking-[0.22em] text-circus-red">{{ t('home.brandTagline') }}</p>
        <h1 class="circus-heading mt-3 whitespace-nowrap text-[clamp(2.5rem,6.2vw,4.6rem)] font-bold leading-none"><span class="text-circus-red">Kof</span>workshop</h1>
        <p class="script mt-3 text-3xl text-[#f3c7cb]">{{ t('home.handLine') }}</p>
        <p class="mt-4 max-w-xl text-circus-muted">{{ t('home.subtitle') }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/products')" class="circus-btn-primary">{{ t('home.ctaProducts') }}</NuxtLink>
          <NuxtLink :to="localePath('/patterns')" class="circus-btn-secondary">{{ t('home.ctaPatterns') }}</NuxtLink>
        </div>
      </div>

      <div v-if="featured" v-reveal class="hero-pick reveal" style="--rd: 120ms">
        <div class="hero-frame">
          <button type="button" class="block w-full" @click="open(featured)">
            <img :src="featuredImage" :alt="featuredTitle" class="aspect-square w-full rounded-2xl object-cover">
          </button>
          <span class="hero-badge">
            {{ featuredStock }}
          </span>
          <div class="hero-tag">
            <h2 class="hero-tag-name">
              <button type="button" @click="open(featured)">{{ featuredTitle }}</button>
            </h2>
            <p class="hero-tag-price">{{ featuredPrice }} {{ t('currency') }}</p>
            <p class="hero-tag-sub">
              {{ featuredStock }}
            </p>
            <button class="circus-btn-primary mt-2 w-full px-3 py-1.5 text-xs" @click="addFeatured">{{ t('products.addToCart') }}</button>
          </div>
        </div>
        <p class="hero-pull script">{{ t('home.stitchLine') }}</p>
      </div>
    </section>

    <section class="mt-14">
      <div class="mb-4 flex items-end justify-between gap-3">
        <h2 class="circus-heading text-3xl font-bold">{{ t('home.nowInStock') }}</h2>
        <NuxtLink :to="localePath('/products')" class="script text-2xl text-[#f3c7cb]">{{ t('home.allCatalog') }}</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-for="(product, index) in stockGoods.slice(0, 4)" :key="product.slug" v-reveal class="reveal" :style="{ '--rd': `${index * 70}ms` }">
          <ProductCard :product="product" @zoom="open(product)" />
        </div>
      </div>
    </section>

    <section v-if="upcomingMarket || shelves?.length" class="mt-14 grid gap-4 lg:grid-cols-2">
      <article v-if="upcomingMarket" v-reveal class="paper reveal p-6">
        <p class="script text-2xl text-circus-red">{{ upcomingMarket.is_past ? t('home.marketTitlePast') : t('home.marketTitle') }}</p>
        <h2 class="mt-1 font-display text-2xl font-bold">
          <a v-if="upcomingMarket.link" :href="upcomingMarket.link" target="_blank" rel="noopener noreferrer">{{ upcomingMarket.name }}</a>
          <template v-else>{{ upcomingMarket.name }}</template>
        </h2>
        <p class="mt-2 paper-muted">{{ marketPeriod }}</p>
        <p v-if="upcomingMarket.address" class="text-sm paper-muted">{{ upcomingMarket.address }}</p>
      </article>
      <article v-if="shelves?.length" v-reveal class="paper reveal p-6" style="--rd: 80ms">
        <p class="script text-2xl text-circus-red">{{ t('home.shelvesTitle') }}</p>
        <ul class="mt-3 space-y-3">
          <li v-for="shelf in shelves" :key="shelf.name">
            <p class="font-semibold">{{ shelf.name }}</p>
            <p v-if="shelf.address" class="text-sm paper-muted">{{ shelf.address }}</p>
          </li>
        </ul>
      </article>
    </section>

    <section v-reveal class="paper reveal mt-6 p-6">
      <h2 class="font-display text-2xl font-bold">{{ t('home.craftTitle') }}</h2>
      <p class="mt-2 paper-muted">{{ t('home.craftSubtitle') }}</p>
      <ul class="mt-4 grid gap-2 md:grid-cols-2">
        <li v-for="item in services" :key="item" class="rounded-2xl bg-white/70 px-4 py-3 text-sm">{{ item }}</li>
      </ul>
    </section>

    <section v-reveal class="paper reveal mt-6 p-6">
      <h2 class="font-display text-2xl font-bold">{{ t('home.deliveryTitle') }}</h2>
      <ul class="mt-3 space-y-2 text-sm paper-muted">
        <li v-for="item in deliveryItems" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section v-reveal class="paper reveal mt-6 p-6">
      <h2 class="font-display text-2xl font-bold">{{ t('home.socialTitle') }}</h2>
      <p class="mt-2 paper-muted">{{ t('home.socialSubtitle') }}</p>
      <NuxtLink :to="localePath('/socials')" class="circus-btn-primary mt-4">{{ t('home.openSocialsPage') }}</NuxtLink>
      <div class="mt-4 flex flex-wrap gap-2">
        <a v-for="link in socialLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer" class="rounded-full border border-[#e4d8ce] px-3 py-1 text-sm hover:border-circus-red">
          {{ t(`social.${link.key}`) }}
        </a>
      </div>
    </section>
  </div>
</template>
