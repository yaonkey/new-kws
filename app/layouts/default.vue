<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
    <SiteFooter />
    <CartDrawer />
  </div>
</template>
