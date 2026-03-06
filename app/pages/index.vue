<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

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
      <h1 class="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">{{ t('home.title') }}</h1>
      <p class="mt-4 max-w-2xl text-stone-600">{{ t('home.subtitle') }}</p>
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
  </div>
</template>
