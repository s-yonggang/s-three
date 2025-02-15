<template>
  <div class="webrtc-texture-wrapper">
    <div class="container" ref="containerDemo15">
      <div class="loading-wrap" v-if="!isDone">
        <LoadingAniation></LoadingAniation>
      </div>
    </div>
    <div class="webrtc-wrapper">
      <div class="webrtc">
        <h1>WebRTC 视频</h1>
        <video ref="videoRef" playsinline autoplay></video>
        <span>注意：需要连接摄像头，移动端暂时没有做适配</span>
      </div>
      <!-- <canvas ref="canvasRef"></canvas> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import LoadingAniation from '@/components/LoadingAniation.vue';
import { Worlds } from './main';
import { createRtc } from './create-rtc';

const videoRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);

const containerDemo15 = ref<HTMLDivElement | null>(null);
const isDone = ref<boolean>(false);
const done = () => (isDone.value = true);
let container: HTMLDivElement | null;
let world: Worlds | null;
let stream: any | null;
let video: any | null;
onMounted(async () => {
  stream = (await createRtc(
    videoRef.value as HTMLElement,
    canvasRef.value as HTMLElement,
  )) as any;
  video = videoRef.value as HTMLVideoElement;
  video.srcObject = stream;

  container = containerDemo15.value;
  world = new Worlds(container as HTMLDivElement);
  world?.init(done, video);
});

onUnmounted(() => {});

onBeforeRouteLeave(() => {
  world?.destroy();
  world = null;
  container = null;
  stream?.getTracks().forEach((track: any) => {
    track.stop(); // 停止单个轨道
  });
  video = null;
});
</script>

<style scoped>
.webrtc-texture-wrapper {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}

.container {
  position: relative;
  width: 50%;
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

.webrtc-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* margin: 0 10px; */
  width: 50%;
  height: 100%;
  background-color: #d0d0d0b3;
  overflow: hidden;
}
.webrtc {
  width: 50%;
  height: auto;
  text-align: center;
  /* color: #fff; */
}
.webrtc video {
  width: 100%;
  margin: 30px auto 20px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  /* border: 1cap solid #000;
  background-color: #000; */
}
.webrtc span {
  padding: 4px 8px;
  /* background-color: antiquewhite;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3); */
}
</style>
