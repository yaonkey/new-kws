<template>
  <div class="relative flex min-h-screen flex-col">
    <div class="site-stripes pointer-events-none fixed inset-0 z-0" />
    <div class="site-breath pointer-events-none fixed inset-0 z-0" />
    <SiteHeader />
    <main class="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
    <SiteFooter class="relative z-10" />
    <CartFly />
    <CartDrawer />
    <ProductQuickView />
  </div>
</template>
