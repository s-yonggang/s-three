<template>
  <div class="container" ref="containerDemo3"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { Worlds } from "./mian.tsx"
const containerDemo3 = ref<HTMLElement | null>(null)

onMounted(() => {
  const container = containerDemo3.value;
  const world = new Worlds(container);
  world.init();
  world.start();
})

onUnmounted(() => {

})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
