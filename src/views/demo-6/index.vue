<template>
  <div class="container" ref="containerDemo6"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Worlds } from './mian.js';
const containerDemo6 = ref<HTMLElement | null>(null);

onMounted(() => {
  const container: any = containerDemo6.value;
  const world = new Worlds(container);
  world.init(container);
  world.start();
});

onUnmounted(() => {});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
