<template>
  <div class="container" ref="containerDemo6">
    <div class="loading-wrap" v-if="!isDone">
      <LoadingAniation></LoadingAniation>
    </div>
    <div v-else class="keyboard">
      <div>
        <div>W</div>
      </div>
      <div>
        <div>A</div>
        <div>S</div>
        <div>D</div>
      </div>
      <div>Space</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './mian.js';
const containerDemo6 = ref<HTMLElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);

onMounted(() => {
  const container: any = containerDemo6.value;
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
  z-index: 99;
}

.keyboard {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
.keyboard > div:nth-child(1) > div,
.keyboard > div:nth-child(2) > div,
.keyboard > div:nth-child(3) {
  width: 2.4em;
  height: 2.4em;
  margin: 2px 0;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 2.4em;
  border-radius: 4px;
}
.keyboard > div:nth-child(1) {
  display: flex;
  justify-content: center;
  width: 7.4rem;
}
.keyboard > div:nth-child(2) {
  display: flex;
  justify-content: space-between;
  width: 7.4rem;
}
.keyboard > div:nth-child(3) {
  width: 7.4rem;
}
</style>
