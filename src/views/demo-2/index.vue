<template>
  <div class="buildingDemo" ref="textureDemoRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './ball_vt.glsl';
import fragmentShader from './ball_gm.glsl';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { cos } from "three/examples/jsm/nodes/Nodes.js";
import url from '@/assets/images/eng2.jpeg';
const textureDemoRef = ref<HTMLElement | null>(null);
/**
 * GUI
 */
let gui: any = new GUI();
onMounted(() => {
  init();
});
onUnmounted(() => {
  gui.destroy();
  gui = null;
});

function init() {
  const container: any = textureDemoRef.value;
  const width: any = container?.clientWidth;
  const height: any = container?.clientHeight;
  let scene: any, camera: any, renderer: any;

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0x8cc7de, 1, 600);

  const axesHelper = new THREE.AxesHelper(100);
  // scene.add(axesHelper);

  const helper = new THREE.GridHelper(1000, 100);
  helper.position.y = -50;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  /**
   * 模型
   */
  // 自然光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  // 平行光
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(100, 100, 100);
  dirLight.castShadow = true;
  scene.add(dirLight);

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
  camera.position.set(20, 80, 40);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ReinhardToneMapping; // 色调映射
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const texture: any = textureLoader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;

  const materialShader: any = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uThickness: {
        value: 4.0,
      },
      uNoiseTexture: {
        value: null,
      },
      uColor: {
        value: new THREE.Color(0x00e1ff),
      },
      uTime: {
        value: 0,
      },
    },
    transparent: true,
    // opacity: 1,
    blending: THREE.AdditiveBlending,
  });
  materialShader.uniforms.uNoiseTexture.value = texture;

  const geometry = new THREE.SphereGeometry(20, 64, 64);
  // let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geometry, materialShader);
  mesh.rotateY(-Math.PI);
  scene.add(mesh);

  const energyFolder = gui.addFolder('energy');
  energyFolder.addColor(materialShader.uniforms.uColor, 'value');
  energyFolder
    .add(materialShader.uniforms.uThickness, 'value')
    .min(2)
    .max(10)
    .step(0.01)
    .name('uThickness');

  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.update();
  controls.minDistance = 50;
  controls.maxDistance = 100;
  // controls.maxPolarAngle = Math.PI / 2.2;

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    materialShader.uniforms.uTime.value += 0.002;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
</script>

<style scoped>
.buildingDemo {
  width: 100%;
  height: 100%;
}
</style>
