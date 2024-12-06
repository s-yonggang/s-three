<template>
  <div class="container" ref="containerDemo8">
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './mian.js';
const containerDemo8 = ref<HTMLElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);

onMounted(() => {
  const container: any = containerDemo8.value;
  const world = new Worlds(container);
  world.init(done);
});

onUnmounted(() => {});
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.loading-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 0, 0);
}
</style>
