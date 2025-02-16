<template>
  <div class="container" ref="containerDemo20">
    <div id="labels" ref="labelRef"></div>
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
const containerDemo20 = ref<HTMLDivElement | null>(null);
const labelRef = ref<HTMLDivElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);
let container: HTMLDivElement | null;
let label: HTMLDivElement | null;

let world: Worlds | null;
onMounted(() => {
  container = containerDemo20.value;
  label = labelRef.value;
  world = new Worlds(container as HTMLDivElement);
  world?.init(label as HTMLDivElement, done);
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
:deep()#labels {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  color: #fff;
}
:deep()#labels > div {
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  font-size: small;
  user-select: none;
  pointer-events: none;
  text-shadow:
    -1px -1px 0 #000,
    0 -1px 0 #000,
    1px -1px 0 #000,
    1px 0 0 #000,
    1px 1px 0 #000,
    0 1px 0 #000,
    -1px 1px 0 #000,
    -1px 0 0 #000;
}
/* :deep()#labels > div:hover {
  color: red;
} */
</style>
