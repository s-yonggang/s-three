<template>
  <div class="container" ref="containerDemo4"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Worlds } from './mian.ts';
const containerDemo4 = ref<HTMLElement | null>(null);

onMounted(() => {
  const container = containerDemo4.value;
  const world = new Worlds(container);
  world.init();
  world.start();
  // container?.addEventListener('click', () => {
  //   world.stoop();
  //   setTimeout(() => {
  //     world.init();
  //     world.start();
  //   }, 3000);
  // });
});

onUnmounted(() => {});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
