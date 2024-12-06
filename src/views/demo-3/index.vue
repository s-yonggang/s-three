<template>
  <div class="container" ref="containerDemo3">
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './mian.tsx';
const containerDemo3 = ref<HTMLElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);

onMounted(() => {
  const container = containerDemo3.value;
  const world = new Worlds(container);
  world.init(done);
});

onUnmounted(() => {});
</script>

<style scoped>
.container {
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
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
</style>
