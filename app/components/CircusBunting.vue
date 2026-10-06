<template>
  <div class="circus-bunting pointer-events-none absolute inset-x-0 top-0 z-20 flex h-11 flex-nowrap overflow-hidden" aria-hidden="true">
    <span class="circus-bunting-rope" />
    <span
      v-for="index in 120"
      :key="index"
      class="circus-bunting-item circus-bunting-sway"
      :class="index % 2 ? 'circus-bunting-red' : 'circus-bunting-light'"
      :style="{ '--base-y': `${Math.sin(index / 2.6) * 5}px`, animationDelay: `-${index * 70}ms` }"
    />
  </div>
</template>
