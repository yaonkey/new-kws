<template>
  <div class="pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true">
    <div class="tent-walls absolute inset-x-0 bottom-0 top-[32%]" />
    <div class="tent-cloth absolute inset-0" />
    <div class="tent-shade absolute inset-0" />
    <div class="tent-hem absolute inset-x-0 top-[32%] -translate-y-1/2" />

    <span class="tent-star left-[16%] top-[18%]" style="animation-delay: 0.2s" />
    <span class="tent-star left-[31%] top-[12%]" style="animation-delay: 1.1s" />
    <span class="tent-star right-[31%] top-[12%]" style="animation-delay: 0.6s" />
    <span class="tent-star right-[16%] top-[18%]" style="animation-delay: 1.6s" />

    <div class="absolute inset-x-[3%] top-[32%] flex -translate-y-1/2 justify-between">
      <span v-for="n in 17" :key="`bulb-${n}`" class="tent-bulb" :style="{ animationDelay: `${(n % 5) * 0.38}s` }" />
    </div>

    <div class="absolute inset-x-[6%] top-[32%] flex justify-between">
      <span
        v-for="n in 11"
        :key="`flag-${n}`"
        class="tent-pennant"
        :class="n % 2 === 0 ? 'is-cream' : ''"
        :style="{ animationDelay: `${n * 0.23}s` }"
      />
    </div>

    <div class="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-[#f6f0e8]" />
    <span class="tent-flag" />
    <span class="absolute left-1/2 top-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-[#f6f0e8] bg-[#24161c]" />
  </div>
</template>
