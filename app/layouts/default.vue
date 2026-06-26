<template>
  <div class="relative flex min-h-screen flex-col">
    <div class="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div
        class="absolute inset-0 bg-cover bg-right opacity-65"
        style="background-image: url('/images/site-bg-circus-right.jpg'); filter: brightness(1.2) contrast(1.06);"
      />
      <video
        class="absolute inset-0 h-full w-full object-cover opacity-72"
        style="object-position: 86% center;"
        autoplay
        muted
        loop
        playsinline
      >
        <source src="/videos/bg-video.webm" type="video/webm" />
        <source src="/videos/bg-video.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_20%,rgba(18,25,38,0.62),rgba(10,10,15,0.84))]" />
      <div class="absolute inset-y-0 left-0 w-[18vw] bg-[linear-gradient(90deg,rgba(10,10,15,0.92),rgba(10,10,15,0))]" />
      <div class="absolute inset-y-0 right-0 w-[24vw] bg-[linear-gradient(270deg,rgba(10,10,15,0.88),rgba(10,10,15,0))]" />
    </div>
    <SiteHeader class="relative z-10" />
    <main class="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
    <SiteFooter class="relative z-10" />
    <CartDrawer />
  </div>
</template>
