import { WebGLRenderer } from "three";
import { WebGPURenderer } from "three/webgpu";
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

function createGLRenderer(devicePixelRatio: number = 1): WebGLRenderer {
  const renderer: any = new WebGLRenderer({ antialias: true });
  // renderer.setPixelRatio(devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  return renderer
}

function createGPURenderer(devicePixelRatio: number = 1): WebGLRenderer {
  const renderer: any = new WebGPURenderer({ antialias: true });
  // renderer.setPixelRatio(devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  return renderer
}

function createCSS3DRenderer(): WebGLRenderer {
  const renderer: any = new CSS3DRenderer();
  renderer.physicallyCorrectLights = true;
  return renderer
}

function useWorkerGLRenderer(canvas: any, devicePixelRatio: number = 1): WebGLRenderer {
  const renderer: any = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  return renderer
}


export { createGLRenderer, createGPURenderer, createCSS3DRenderer, useWorkerGLRenderer }
