<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="border-t border-stone-200 bg-white">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-stone-600 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
      <p>{{ t('footer.copyright') }}</p>
      <div class="flex gap-4">
        <NuxtLink :to="localePath('/products')" class="hover:text-emerald-700">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="hover:text-emerald-700">{{ t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="localePath('/about')" class="hover:text-emerald-700">{{ t('nav.about') }}</NuxtLink>
      </div>
    </div>
  </footer>
</template>
