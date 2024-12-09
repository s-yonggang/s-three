<template>
  <div class="container" ref="containerDemo10">
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './main';
const containerDemo10 = ref<HTMLDivElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);
onMounted(() => {
  const container: HTMLDivElement | null = containerDemo10.value;
  const world = new Worlds(container as HTMLDivElement);
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
