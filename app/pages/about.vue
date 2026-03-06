<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('seo.aboutTitle'),
  description: t('about.description'),
})
</script>

<template>
  <section class="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-8">
    <h1 class="text-3xl font-bold text-stone-900">{{ t('about.title') }}</h1>
    <p class="mt-4 leading-relaxed text-stone-700">
      {{ t('about.description') }}
    </p>
  </section>
</template>
