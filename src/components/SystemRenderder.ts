import { WebGLRenderer } from "three";
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

function createRenderer(): WebGLRenderer {
  const renderer: any = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  return renderer
}

function createCSS3DRenderer(): WebGLRenderer {
  const renderer: any = new CSS3DRenderer();
  renderer.physicallyCorrectLights = true;
  return renderer
}

export { createRenderer, createCSS3DRenderer }
