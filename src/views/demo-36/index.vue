<template>
  <div class="container" ref="containerDemo36">
    <div class="toolbar">
      <div title="平移，快捷键W" @click="transform('translate')">
        <IconTranslate />
      </div>
      <div title="旋转，快捷键E" @click="transform('rotate')">
        <IconRotation />
      </div>
      <div title="缩放，快捷键R" @click="transform('scale')">
        <IconScale />
      </div>
    </div>
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

import IconTranslate from '@/components/icons/IconTranslate.vue';
import IconRotation from '@/components/icons/IconRotation.vue';
import IconScale from '@/components/icons/IconScale.vue';

const containerDemo36 = ref<HTMLDivElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);
let container: HTMLDivElement | null;
let world: Worlds | null;
let transform: any;

onMounted(async () => {
  container = containerDemo36.value;
  world = new Worlds(container as HTMLDivElement);
  transform = await world?.init(done);
});

onUnmounted(() => {});

onBeforeRouteLeave(() => {
  world?.destroy();
  world = null;
  container = null;
  transform = null;
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
.toolbar {
  position: absolute;
  top: 20px;
  left: 10px;

  background-color: #333;
  color: #fff;
}
.toolbar > div {
  padding: 8px 10px 6px;
  border-bottom: 1px solid #666;
}
.toolbar > div:last-child {
  border-bottom: none;
}
.toolbar > div:hover {
  cursor: pointer;
}
</style>
