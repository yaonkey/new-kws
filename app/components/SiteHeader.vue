<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { itemCount } = useCart()
const { open } = useCartDrawer()
const mobileMenuOpen = ref(false)

const setLocale = async (nextLocale: 'ru' | 'en') => {
  if (locale.value === nextLocale) {
    return
  }
  mobileMenuOpen.value = false
  await navigateTo(switchLocalePath(nextLocale))
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-circus-border bg-circus-bg/95 backdrop-blur relative overflow-visible">
    <div class="pointer-events-none absolute inset-x-0 -top-1 z-20 flex h-7 items-start justify-start gap-[1px] overflow-hidden">
      <span
        v-for="index in 220"
        :key="`header-flag-${index}`"
        class="circus-bunting-item circus-bunting-sway h-6 w-[19px] shrink-0"
        :class="index % 2 ? 'circus-bunting-red' : 'circus-bunting-light'"
        :style="{ '--base-y': `${Math.sin(index / 3.4) * 7 + 1.2}px`, animationDelay: `-${index * 32}ms` }"
      />
    </div>
    <div class="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-3">
        <NuxtImg src="/images/brand-logo-cutout.png" alt="Kofworkshop" width="52" height="52" class="h-12 w-12 object-contain" />
        <span class="circus-heading text-xl font-semibold">Kofworkshop</span>
      </NuxtLink>

      <nav class="hidden gap-6 text-sm font-medium md:flex">
        <NuxtLink :to="localePath('/products')" class="text-circus-muted hover:text-circus-white">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/patterns')" class="text-circus-muted hover:text-circus-white">{{ t('nav.patterns') }}</NuxtLink>
        <NuxtLink :to="localePath('/socials')" class="text-circus-muted hover:text-circus-white">{{ t('nav.socials') }}</NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <button class="rounded border border-circus-border bg-circus-surface px-3 py-1 text-xs text-circus-text md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
          ☰
        </button>
        <button class="hidden rounded border border-circus-red bg-circus-red px-3 py-1 text-xs font-semibold text-circus-white md:inline-flex" @click="open">
          {{ t('nav.cart') }} ({{ itemCount }})
        </button>
        <div class="relative hidden rounded-full border border-circus-border bg-circus-surface p-0.5 text-xs md:flex">
          <span
            class="pointer-events-none absolute inset-y-0.5 w-1/2 rounded-full bg-circus-red transition-transform duration-200"
            :class="locale === 'en' ? 'translate-x-full' : 'translate-x-0'"
          />
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'ru' ? 'text-circus-white' : 'text-circus-muted'"
            @click="setLocale('ru')"
          >
            RU
          </button>
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'en' ? 'text-circus-white' : 'text-circus-muted'"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
      </div>
    </div>
    <nav v-if="mobileMenuOpen" class="border-t border-circus-border bg-circus-surface px-4 py-3 md:hidden">
      <div class="flex flex-col gap-3 text-sm font-medium">
        <NuxtLink :to="localePath('/products')" class="text-circus-muted hover:text-circus-white" @click="mobileMenuOpen = false">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/patterns')" class="text-circus-muted hover:text-circus-white" @click="mobileMenuOpen = false">{{ t('nav.patterns') }}</NuxtLink>
        <NuxtLink :to="localePath('/socials')" class="text-circus-muted hover:text-circus-white" @click="mobileMenuOpen = false">{{ t('nav.socials') }}</NuxtLink>
        <button class="inline-flex w-fit rounded border border-circus-red bg-circus-red px-3 py-1 text-xs text-circus-white" @click="open(); mobileMenuOpen = false">
          {{ t('nav.cart') }} ({{ itemCount }})
        </button>
        <div class="relative mt-1 flex w-fit rounded-full border border-circus-border bg-circus-bg p-0.5 text-xs">
          <span
            class="pointer-events-none absolute inset-y-0.5 w-1/2 rounded-full bg-circus-red transition-transform duration-200"
            :class="locale === 'en' ? 'translate-x-full' : 'translate-x-0'"
          />
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'ru' ? 'text-circus-white' : 'text-circus-muted'"
            @click="setLocale('ru')"
          >
            RU
          </button>
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'en' ? 'text-circus-white' : 'text-circus-muted'"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
