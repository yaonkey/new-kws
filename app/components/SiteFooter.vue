<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

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
]
</script>

<template>
  <footer class="relative border-t border-circus-border bg-circus-surface">
    <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 text-sm text-circus-muted sm:px-6 lg:px-8">
      <p>{{ t('footer.copyright') }}</p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink :to="localePath('/products')" class="hover:text-circus-white">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/patterns')" class="hover:text-circus-white">{{ t('nav.patterns') }}</NuxtLink>
        <NuxtLink :to="localePath('/socials')" class="hover:text-circus-white">{{ t('nav.socials') }}</NuxtLink>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="link in socialLinks"
          :key="link.key"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full border border-circus-border bg-circus-bg px-3 py-1 text-xs hover:border-circus-red hover:text-circus-white"
        >
          {{ t(`social.${link.key}`) }}
        </a>
      </div>
    </div>
  </footer>
</template>
