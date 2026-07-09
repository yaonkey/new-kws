<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const { fetchUpcomingMarket, formatMarketPeriod } = useMarketsApi()
const { fetchShelves } = useShelvesApi()
const { data: upcomingMarket } = await useAsyncData('upcoming-market', fetchUpcomingMarket, {
  default: () => null,
})
const { data: shelves } = await useAsyncData('public-shelves', fetchShelves, {
  default: () => [],
})

const marketPeriod = computed(() =>
  upcomingMarket.value ? formatMarketPeriod(upcomingMarket.value, locale.value) : '',
)

const isRu = computed(() => locale.value === 'ru')

const services = computed(() =>
  isRu.value
    ? [
        'Написание схем игрушек',
        'Создание уникальных игрушек под запрос',
        'Разработка новых коллекций к сезону',
        'Изделия не только для детей: схемы, аксессуары и декор',
      ]
    : [
        'Pattern writing for handmade toys',
        'Custom toy creation based on your request',
        'New seasonal product design',
        'Not only toys: patterns, accessories, and decor',
      ],
)

const deliveryItems = computed(() =>
  isRu.value
    ? [
        'Москва: доставка к метро от 100 до 350 руб',
        'Самовывоз: пос. Рублево, ул. Новорублевская, д. 2',
        'По России: Почта России и Яндекс Доставка',
        'При заказе от 900 руб доставка по РФ — 100 руб',
      ]
    : [
        'Moscow: metro delivery from 100 to 350 RUB',
        'Pickup: Rublyovo, Novorublevskaya 2',
        'Russia-wide shipping via Russian Post and Yandex Delivery',
        'Orders over 900 RUB ship for 100 RUB',
      ],
)

const socialLinks = computed(() =>
  [
    { key: 'vk', href: 'https://vk.com/kofworkshop' },
    { key: 'telegram', href: 'https://t.me/kofworkshop' },
    { key: 'instagram', href: 'https://instagram.com/kofworkshop' },
    { key: 'reddit', href: 'https://www.reddit.com/r/kofworkshop/' },
    { key: 'boosty', href: 'https://boosty.to/kofonkina' },
    { key: 'pinterest', href: 'https://www.pinterest.com/kofworkshop/' },
    { key: 'flowwow', href: 'https://flowwow.com/shop/kofworkshop/' },
    { key: 'twitch', href: 'https://twitch.tv/bakasempaides' },
    { key: 'pikabu', href: 'https://pikabu.ru/@megawhat' },
  ] as const,
)

useSeoMeta({
  title: t('seo.homeTitle'),
  description: t('home.subtitle'),
  ogTitle: `Handmade Workshop - ${t('seo.homeTitle')}`,
  ogDescription: t('home.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/')}`,
})
</script>

<template>
  <div>
    <section class="circus-card animate-riseFade p-8 md:p-10">
      <NuxtImg src="/images/brand-logo-cutout.png" alt="Kofworkshop logo" width="180" height="180" sizes="180px" class="mb-6 h-24 w-24 object-contain" />
      <p class="mb-2 text-xs uppercase tracking-[0.2em] text-circus-red">
        {{ t('home.brandTagline') }}
      </p>
      <h1 class="circus-heading text-3xl font-bold md:text-5xl">
        {{ t('home.title') }}
      </h1>
      <p class="mt-4 max-w-3xl text-circus-muted">
        {{ t('home.subtitle') }}
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink :to="localePath('/products')" class="circus-btn-primary">
          {{ t('home.ctaProducts') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/patterns')" class="circus-btn-secondary">
          {{ t('home.ctaPatterns') }}
        </NuxtLink>
      </div>
    </section>

    <section v-if="upcomingMarket" class="circus-card mt-8 p-6 md:p-8">
      <p class="mb-2 text-xs uppercase tracking-[0.2em] text-circus-red">
        {{ upcomingMarket.is_past ? t('home.marketTitlePast') : t('home.marketTitle') }}
      </p>
      <h2 class="circus-heading text-2xl font-semibold">
        <a
          v-if="upcomingMarket.link"
          :href="upcomingMarket.link"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-circus-red"
        >
          {{ upcomingMarket.name }}
        </a>
        <template v-else>{{ upcomingMarket.name }}</template>
      </h2>
      <p class="mt-2 text-circus-muted">{{ marketPeriod }}</p>
      <p v-if="upcomingMarket.address" class="mt-1 text-sm text-circus-muted">{{ upcomingMarket.address }}</p>
      <p class="mt-3 text-sm font-medium text-circus-text">
        {{
          upcomingMarket.is_current
            ? t('home.marketCurrent')
            : upcomingMarket.is_past
              ? t('home.marketPast')
              : t('home.marketUpcoming')
        }}
      </p>
    </section>

    <section v-if="shelves?.length" class="circus-card mt-8 p-6 md:p-8">
      <p class="mb-2 text-xs uppercase tracking-[0.2em] text-circus-red">{{ t('home.shelvesTitle') }}</p>
      <ul class="space-y-4">
        <li v-for="shelf in shelves" :key="shelf.name" class="rounded-lg border border-circus-border bg-circus-surfaceSoft px-4 py-3">
          <h2 class="circus-heading text-lg font-semibold">{{ shelf.name }}</h2>
          <p v-if="shelf.address" class="mt-1 text-sm text-circus-muted">{{ shelf.address }}</p>
        </li>
      </ul>
    </section>

    <section class="circus-card mt-8 p-6">
      <h2 class="circus-heading text-2xl font-semibold">{{ t('home.craftTitle') }}</h2>
      <p class="mt-2 text-circus-muted">{{ t('home.craftSubtitle') }}</p>
      <ul class="mt-4 grid gap-2 md:grid-cols-2">
        <li v-for="item in services" :key="item" class="rounded-lg border border-circus-border bg-circus-surfaceSoft px-4 py-3 text-sm text-circus-text">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="mt-8">
      <article class="circus-card p-6">
        <h3 class="circus-heading text-xl font-semibold">{{ t('home.deliveryTitle') }}</h3>
        <ul class="mt-3 space-y-2 text-sm text-circus-muted">
          <li v-for="item in deliveryItems" :key="item">- {{ item }}</li>
        </ul>
      </article>
    </section>

    <section class="circus-card mt-8 p-6">
      <h3 class="circus-heading text-xl font-semibold">{{ t('home.socialTitle') }}</h3>
      <p class="mt-2 text-sm text-circus-muted">{{ t('home.socialSubtitle') }}</p>
      <NuxtLink :to="localePath('/socials')" class="circus-btn-secondary mt-3">
        {{ t('home.openSocialsPage') }}
      </NuxtLink>
      <div class="mt-3 flex flex-wrap gap-2">
        <a
          v-for="link in socialLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full border border-circus-border px-4 py-2 text-sm text-circus-muted hover:border-circus-red hover:text-circus-white"
        >
          {{ t(`social.${link.key}`) }}
        </a>
      </div>
    </section>
  </div>
</template>
