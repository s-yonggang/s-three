import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import { createCamera } from '@/components/WorldCamera';
import { Loop } from '@/components/SystemLoop';
import { createModels } from "./models";
import { createLights } from "./lights";
const state = {
  width: 300, // canvas default
  height: 150, // canvas default
  dpr: 1,
  textureData: null
};

async function main(data) {

  const { canvas } = data;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  state.width = canvas.width;
  state.height = canvas.height;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const fov = 60;
  const aspect = state.width / canvas.height;
  const near = 0.01;
  const far = 2000;
  const camera = createCamera({ fov, aspect, near, far });
  camera.position.z = 6;

  const material = new THREE.MeshPhongMaterial({ color: 0xdddddd, map: state.textureData })
  const geometry = new THREE.SphereGeometry(2, 64, 32);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.tick = () => {
    // mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.002;
    // mesh.rotation.z += 0.001;
  }

  const { directionalLight, ambientLight } = createLights()
  scene.add(mesh, directionalLight, ambientLight);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = state.width;
    const height = state.height;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    // time *= 0.001;
    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = state.width / state.height;
      camera.updateProjectionMatrix();
    }
    if(state.textureData){
      mesh.material.map = state.textureData;
      material.needsUpdate = true;
      state.textureData = null;
      console.log('+++')
    }
    mesh.tick();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render()
}

function size(data) {
  state.width = data.width;
  state.height = data.height;
}

function textureData(data) {
  const imageBitmap = data.imageBitmap;
  const texture = new THREE.CanvasTexture(imageBitmap);
  state.textureData = texture;
}

const handlers = {
  main,
  size,
  textureData,
};

self.onmessage = function (e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== 'function') {
    throw new Error('no handler for type: ' + e.data.type);
  }
  fn(e.data);
};
