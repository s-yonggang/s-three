import { WebGLRenderer } from "three";

function createRenderer(): WebGLRenderer {
  const renderer: any = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  return renderer
}
export { createRenderer }
