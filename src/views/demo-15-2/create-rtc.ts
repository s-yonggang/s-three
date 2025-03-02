
const constraints = {
  audio: false,
  video: true
};
// function canvasDraw(video: HTMLElement, canvas: HTMLElement) {
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
// }

async function createRtc(video: HTMLElement, canvas: HTMLElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // window.stream = stream;
    return stream;
    // setInterval(() => {
    //   canvasDraw(video, canvas);
    // }, 1000)
  } catch {
    console.log('navigator.MediaDevices.getUserMedia error: ', "webrtc error");
  }
}


export { createRtc }
