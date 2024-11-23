<template>
  <div class="container" ref="containerDemo7"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Worlds } from './mian.js';
const containerDemo7 = ref<HTMLElement | null>(null);

onMounted(() => {
  const container: any = containerDemo7.value;
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
