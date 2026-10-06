<script setup lang="ts">
const { flies } = useCartFx()
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
    <img
      v-for="fly in flies"
      :key="fly.id"
      :src="fly.image"
      alt=""
      class="cart-fly"
      :style="{ left: `${fly.x}px`, top: `${fly.y}px`, '--dx': `${fly.dx}px`, '--dy': `${fly.dy}px` }"
    >
  </div>
</template>
