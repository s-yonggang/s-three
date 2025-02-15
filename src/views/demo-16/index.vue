<template>
  <div class="container" ref="containerDemo16">
    <canvas id="c" ref="cRef"></canvas>
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
  </div>
</template>

<script setup lang="ts">
// import Worker "worker.js";
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './main';
const containerDemo16 = ref<HTMLDivElement | null>(null);
const cRef = ref<HTMLCanvasElement | null>(null);

const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);
let container: HTMLDivElement | null;
let canvas: HTMLCanvasElement | null;
let world: Worlds | null;

onMounted(() => {
  container = containerDemo16.value;
  canvas = cRef.value;
  world = new Worlds(container as HTMLDivElement, canvas as HTMLCanvasElement);
  world?.init(done);
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
  position: relative;
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
  background-color: rgb(0, 0, 0);
}
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
