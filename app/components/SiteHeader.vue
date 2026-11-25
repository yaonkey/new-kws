<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { itemCount } = useCart()
const { pop } = useCartFx()
const { open } = useCartDrawer()
const popping = ref(false)
const compact = ref(false)
const folded = ref(false)
const spacer = ref(0)
const head = ref<HTMLElement | null>(null)
let tearing = false
let lastY = 0

watch(pop, async () => {
  popping.value = false
  await nextTick()
  popping.value = true
})

const tearOff = async () => {
  const el = head.value
  if (!el || tearing || compact.value) return
  tearing = true
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const firstTop = el.getBoundingClientRect().top
  spacer.value = el.offsetHeight
  compact.value = true
  await nextTick()
  if (reduce) {
    tearing = false
    return
  }
  const dy = Math.max(-36, Math.min(0, firstTop - el.getBoundingClientRect().top))
  el.style.transition = 'none'
  el.style.transform = `translateY(${dy}px)`
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.62s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.45s ease, box-shadow 0.62s ease'
      el.style.transform = ''
      window.setTimeout(() => {
        if (el.style.transform === '') el.style.transition = ''
        tearing = false
        onScroll()
      }, 640)
    })
  })
}

const settleBack = async () => {
  const el = head.value
  if (!el || tearing || !compact.value) return
  tearing = true
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  compact.value = false
  el.style.transition = ''
  el.style.transform = ''
  await nextTick()
  window.setTimeout(() => {
    tearing = false
  }, reduce ? 0 : 640)
}

const narrow = () => window.matchMedia('(max-width: 767px)').matches

const onScroll = () => {
  const y = window.scrollY
  if (narrow()) {
    if (y <= 12) folded.value = false
    else if (y > lastY + 10) folded.value = true
    else if (lastY - y > 10) folded.value = false
    lastY = y
    return
  }
  folded.value = false
  lastY = y
  if (tearing) return
  if (!compact.value && y > 72) {
    tearOff()
    return
  }
  if (compact.value && y < 16) settleBack()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const setLocale = async (nextLocale: 'ru' | 'en') => {
  if (locale.value === nextLocale) return
  await navigateTo(switchLocalePath(nextLocale))
}

const links = computed(() => [
  { to: '/', label: t('nav.home'), short: t('nav.home'), exact: true },
  { to: '/products', label: t('nav.products'), short: t('nav.products'), exact: false },
  { to: '/patterns', label: t('nav.patterns'), short: t('nav.patterns'), exact: false },
  { to: '/socials', label: t('nav.socials'), short: t('nav.orderShort'), exact: false },
])

const isCurrent = (to: string, exact: boolean) => {
  const path = route.path.replace(/\/$/, '') || '/'
  const target = localePath(to).replace(/\/$/, '') || '/'
  if (exact) return path === target
  return path === target || path.startsWith(`${target}/`)
}

</script>

<template>
  <div class="site-head-slot" :style="compact ? { height: `${spacer}px` } : undefined">
    <header ref="head" class="site-head" :class="{ 'is-compact': compact, 'is-folded': folded }">
      <nav class="header-nav">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="localePath(link.to)"
          class="nav-link"
          :class="isCurrent(link.to, link.exact) ? 'is-on' : ''"
        >
          <span class="nav-full">{{ link.label }}</span>
          <span class="nav-short">{{ link.short }}</span>
        </NuxtLink>
      </nav>
      <div class="header-tools">
          <div class="head-locale flex shrink-0 rounded-full border border-circus-cream/40 bg-black/35 p-0.5 text-xs text-circus-cream">
            <button class="rounded-full px-2 py-1" :class="locale === 'ru' ? 'bg-circus-red text-circus-cream' : 'text-circus-cream/70'" @click="setLocale('ru')">RU</button>
            <button class="rounded-full px-2 py-1" :class="locale === 'en' ? 'bg-circus-red text-circus-cream' : 'text-circus-cream/70'" @click="setLocale('en')">EN</button>
          </div>
          <button
            id="cart-button"
            class="cart-fab shrink-0"
            :class="{ 'cart-pop': popping }"
            :aria-label="t('nav.cart')"
            @click="open"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span class="cart-label">{{ t('nav.cart') }}</span>
            <span v-if="itemCount" class="cart-count">{{ itemCount }}</span>
          </button>
      </div>
      <NuxtLink :to="localePath('/')" class="head-mark" :aria-label="t('nav.home')">
        <img src="/images/brand-logo-cutout.png" alt="Kofworkshop" width="537" height="601">
      </NuxtLink>
    </header>
  </div>
</template>
