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
  <header class="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink :to="localePath('/')" class="text-lg font-semibold text-stone-900">
        Handmade Workshop
      </NuxtLink>

      <nav class="hidden gap-6 text-sm font-medium md:flex">
        <NuxtLink :to="localePath('/products')" class="hover:text-emerald-700">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="hover:text-emerald-700">{{ t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="localePath('/about')" class="hover:text-emerald-700">{{ t('nav.about') }}</NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <button class="rounded border border-stone-300 px-3 py-1 text-xs hover:bg-stone-100 md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
          ☰
        </button>
        <button class="hidden rounded border border-stone-300 px-3 py-1 text-xs hover:bg-stone-100 md:inline-flex" @click="open">
          {{ t('nav.cart') }} ({{ itemCount }})
        </button>
        <div class="relative hidden rounded-full border border-stone-300 bg-white p-0.5 text-xs md:flex">
          <span
            class="pointer-events-none absolute inset-y-0.5 w-1/2 rounded-full bg-stone-900 transition-transform duration-200"
            :class="locale === 'en' ? 'translate-x-full' : 'translate-x-0'"
          />
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'ru' ? 'text-white' : 'text-stone-700'"
            @click="setLocale('ru')"
          >
            RU
          </button>
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'en' ? 'text-white' : 'text-stone-700'"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
      </div>
    </div>
    <nav v-if="mobileMenuOpen" class="border-t border-stone-200 px-4 py-3 md:hidden">
      <div class="flex flex-col gap-3 text-sm font-medium">
        <NuxtLink :to="localePath('/products')" class="hover:text-emerald-700" @click="mobileMenuOpen = false">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="hover:text-emerald-700" @click="mobileMenuOpen = false">{{ t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="localePath('/about')" class="hover:text-emerald-700" @click="mobileMenuOpen = false">{{ t('nav.about') }}</NuxtLink>
        <button class="inline-flex w-fit rounded border border-stone-300 px-3 py-1 text-xs hover:bg-stone-100" @click="open(); mobileMenuOpen = false">
          {{ t('nav.cart') }} ({{ itemCount }})
        </button>
        <div class="relative mt-1 flex w-fit rounded-full border border-stone-300 bg-white p-0.5 text-xs">
          <span
            class="pointer-events-none absolute inset-y-0.5 w-1/2 rounded-full bg-stone-900 transition-transform duration-200"
            :class="locale === 'en' ? 'translate-x-full' : 'translate-x-0'"
          />
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'ru' ? 'text-white' : 'text-stone-700'"
            @click="setLocale('ru')"
          >
            RU
          </button>
          <button
            class="relative z-10 rounded-full px-3 py-1 transition"
            :class="locale === 'en' ? 'text-white' : 'text-stone-700'"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
