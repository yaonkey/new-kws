<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

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
  isRu.value
    ? [
        { label: 'Telegram: Мария', href: 'https://t.me/Kofonkina/' },
        { label: 'Telegram: Дмитрий', href: 'https://t.me/ya0nkey/' },
        { label: 'Сайт мастерской', href: 'https://kofworkshop.vercel.app/' },
      ]
    : [
        { label: 'Telegram: Maria', href: 'https://t.me/Kofonkina/' },
        { label: 'Telegram: Dmitry', href: 'https://t.me/ya0nkey/' },
        { label: 'Workshop website', href: 'https://kofworkshop.vercel.app/' },
      ],
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
    <section class="rounded-2xl bg-white p-8 shadow-sm">
      <h1 class="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
        {{ isRu ? 'Kofworkshop - творческая мастерская вязаных игрушек' : 'Kofworkshop - creative handmade toy workshop' }}
      </h1>
      <p class="mt-4 max-w-3xl text-stone-600">
        {{
          isRu
            ? 'Небольшая мастерская, где мы создаем игрушки разной сложности и расцветок, а также продаем цифровые PDF-схемы.'
            : 'A small workshop creating handmade toys in different styles and color palettes, plus digital PDF patterns.'
        }}
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink :to="localePath('/products')" class="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
          {{ t('home.ctaProducts') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100">
          {{ t('home.ctaBlog') }}
        </NuxtLink>
      </div>
    </section>

    <section class="mt-8 grid gap-4 md:grid-cols-3">
      <article class="rounded-xl border border-stone-200 bg-white p-5">
        <h2 class="text-sm font-medium text-stone-500">{{ t('home.statsTitle') }}</h2>
        <p class="mt-2 text-2xl font-bold text-stone-900">{{ t('home.statsProducts') }}</p>
      </article>
      <article class="rounded-xl border border-stone-200 bg-white p-5">
        <h2 class="text-sm font-medium text-stone-500">{{ t('home.statsTitle') }}</h2>
        <p class="mt-2 text-2xl font-bold text-stone-900">{{ t('home.statsShipping') }}</p>
      </article>
      <article class="rounded-xl border border-stone-200 bg-white p-5">
        <h2 class="text-sm font-medium text-stone-500">{{ t('home.statsTitle') }}</h2>
        <p class="mt-2 text-2xl font-bold text-stone-900">{{ t('home.statsCustom') }}</p>
      </article>
    </section>

    <section class="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
      <h2 class="text-2xl font-bold text-stone-900">
        {{ isRu ? 'Давайте придумаем игрушку' : 'Let us design your toy' }}
      </h2>
      <p class="mt-2 text-stone-600">
        {{
          isRu
            ? 'Мы создаем уникальные игрушки по запросу заказчика и готовим авторские схемы для самостоятельного вязания.'
            : 'We create unique toys by request and publish original patterns for independent crafting.'
        }}
      </p>
      <ul class="mt-4 grid gap-2 md:grid-cols-2">
        <li v-for="item in services" :key="item" class="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="mt-8 grid gap-6 lg:grid-cols-2">
      <article class="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 class="text-xl font-semibold text-stone-900">{{ isRu ? 'Доставка' : 'Delivery' }}</h3>
        <ul class="mt-3 space-y-2 text-sm text-stone-700">
          <li v-for="item in deliveryItems" :key="item">- {{ item }}</li>
        </ul>
      </article>
      <article class="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 class="text-xl font-semibold text-stone-900">{{ isRu ? 'Соцсети и контакты' : 'Socials and contacts' }}</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <a
            v-for="link in socialLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
          >
            {{ link.label }}
          </a>
        </div>
      </article>
    </section>
  </div>
</template>
