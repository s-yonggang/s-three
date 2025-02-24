<template>
  <div class="container" ref="containerDemo3">
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './mian.tsx';
const containerDemo3 = ref<HTMLElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => {
  const timer = setTimeout(() => {
    isDone.value = true;
    clearTimeout(timer);
  }, 800);
};

let world: Worlds | null;
let container: HTMLDivElement | null;

onMounted(() => {
  container = containerDemo3.value as HTMLDivElement;
  world = new Worlds(container as HTMLDivElement);
  world.init(done);
});
onUnmounted(() => {});

onBeforeRouteLeave(() => {
  world?.destroy();
  world = null;
  container = null;
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  background-color: rgba(0, 0, 0, 1);
  z-index: 99;
}
</style>
