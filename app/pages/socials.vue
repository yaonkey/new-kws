<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const socials = [
  { key: 'vk', href: 'https://vk.com/kofworkshop', icon: 'https://cdn.simpleicons.org/vk/ffffff' },
  { key: 'telegram', href: 'https://t.me/kofworkshop', icon: 'https://cdn.simpleicons.org/telegram/ffffff' },
  { key: 'instagram', href: 'https://instagram.com/kofworkshop', icon: 'https://cdn.simpleicons.org/instagram/ffffff' },
  { key: 'reddit', href: 'https://www.reddit.com/r/kofworkshop/', icon: 'https://cdn.simpleicons.org/reddit/ffffff' },
  { key: 'boosty', href: 'https://boosty.to/kofonkina', icon: 'https://cdn.simpleicons.org/boosty/ffffff' },
  { key: 'pinterest', href: 'https://www.pinterest.com/kofworkshop/', icon: 'https://cdn.simpleicons.org/pinterest/ffffff' },
  { key: 'flowwow', href: 'https://flowwow.com/shop/kofworkshop/', icon: 'https://cdn.simpleicons.org/googlechrome/ffffff' },
  { key: 'twitch', href: 'https://twitch.tv/bakasempaides', icon: 'https://cdn.simpleicons.org/twitch/ffffff' },
  { key: 'pikabu', href: 'https://pikabu.ru/@megawhat', icon: 'https://cdn.simpleicons.org/rss/ffffff' },
]

useSeoMeta({
  title: t('seo.socialsTitle'),
  description: t('socials.subtitle'),
  ogTitle: `Kofworkshop - ${t('seo.socialsTitle')}`,
  ogDescription: t('socials.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/socials')}`,
})
</script>

<template>
  <div>
    <section class="mb-8">
      <h1 class="circus-heading text-3xl font-bold">{{ t('socials.title') }}</h1>
      <p class="mt-2 max-w-3xl text-circus-muted">{{ t('socials.subtitle') }}</p>
    </section>

    <section class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="social in socials"
        :key="social.key"
        :href="social.href"
        target="_blank"
        rel="noopener noreferrer"
        class="circus-card group flex items-center gap-4 p-5 hover:-translate-y-1 hover:animate-glowPulse"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-xl border border-circus-border bg-circus-bg">
          <img :src="social.icon" :alt="t(`social.${social.key}`)" class="h-7 w-7 object-contain" loading="lazy" />
        </div>
        <div class="min-w-0">
          <p class="text-lg font-semibold text-circus-white">{{ t(`social.${social.key}`) }}</p>
          <p class="truncate text-sm text-circus-muted">{{ social.href }}</p>
        </div>
      </a>
    </section>
  </div>
</template>
