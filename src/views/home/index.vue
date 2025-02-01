<template>
  <div class="content-wrapper" ref="canvasWrapperRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GlslCanvas from 'GlslCanvas';
import glslCode from './glsl-code.ts';

const canvasRef = ref<HTMLElement | null>(null);
const canvasWrapperRef = ref<HTMLElement | any>(null);

let canvasBox: any;

function init() {
  const canvas: any = canvasRef.value;
  // const width = canvasWrapperRef.value.width;
  const width = canvasWrapperRef.value.offsetWidth;
  const height = canvasWrapperRef.value.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  canvasBox = new GlslCanvas(canvas);
  canvasBox.load(glslCode);
}

window.addEventListener('resize', () => {
  canvasBox.destroy();
  init();
});

onMounted(() => {
  init();
});
</script>

<style scoped>
.content-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
