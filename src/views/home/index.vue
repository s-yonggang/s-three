<template>
  <div class="share-wrapper" ref="shareWrapperRef">
    <h1 class="title">WebRTC 音视频共享</h1>
    <div class="video-wrapper">
      <video ref="videoRef" id="video" autoplay playsinline muted></video>
    </div>
    <div class="btn-wrapper">
      <select ref="selectRef">
        <option value="default" selected>default</option>
        <option value="browser">browser</option>
        <option value="window">window</option>
        <option value="monitor">monitor</option>
      </select>

      <button type="button" class="" ref="startRef" @click="onStart">
        开始分享
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import adapter from 'webrtc-adapter';

const selectRef = ref<HTMLElement | null>(null);
const startRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLElement | null>(null);

function onStart() {
  const options = { audio: true, video: true };
  const mode = selectRef.value.options[selectRef.value.selectedIndex].value;
  if (mode !== 'default') {
    options.video = { mode } as any;
  }

  navigator.mediaDevices
    .getDisplayMedia(options)
    .then(handleSuccess, handleError);
}

// 操作成功
function handleSuccess(stream: any) {
  startRef.value.disabled = true;
  selectRef.value.disabled = true;
  videoRef.value.srcObject = stream;
  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    startRef.value.disabled = false;
    selectRef.value.disabled = false;
    console.log('The user has ended sharing the screen');
  });
}

// 操作失败
function handleError(error: Error) {
  console.log(`getDisplayMedia error: ${error.name}`, error);
  // errorMsg(`getDisplayMedia error: ${error.name}`, error);
}
// function errorMsg(msg: string, error: Error) {
//   const errorElement = document.querySelector('#errorMsg') as HTMLElement;
//   errorElement.innerHTML += `<p>${msg}</p>`;
//   if (typeof error !== 'undefined') {
//     console.error(error);
//   }
// }

onMounted(() => {
  // if (
  //   adapter.browserDetails.browser === 'chrome' &&
  //   adapter.browserDetails.version >= 107
  // ) {
  //   document.getElementById('options').style.display = 'block';
  // } else if (adapter.browserDetails.browser === 'firefox') {
  //   adapter.browserShim.shimGetDisplayMedia(window, 'screen');
  // }

  if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
    startRef.value.disabled = false;
  } else {
    console.log('getDisplayMedia is not supported');
  }
});
</script>

<style scoped>
.share-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
h1 {
  margin: 20px auto;
  text-align: center;
}
.video-wrapper {
  width: 80%;
  height: 80%;
  margin: 20px auto;
}
.video-wrapper video {
  width: 100%;
  height: 100%;
  background-color: #222;
  border: 1cap solid #222;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
}
.btn-wrapper button {
  margin: 0 20px;
}
</style>
