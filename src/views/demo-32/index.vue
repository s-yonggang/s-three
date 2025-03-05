<template>
  <div class="container" ref="containerDemo32">
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './main';
const containerDemo32 = ref<HTMLDivElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);
let container: HTMLDivElement | null;
let world: Worlds | null;
onMounted(() => {
  container = containerDemo32.value;
  world = new Worlds(container as HTMLDivElement);
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
</style>
