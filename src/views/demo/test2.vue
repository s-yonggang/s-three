<template>
  <div ref="demoRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ViewportGizmo } from 'three-viewport-gizmo';

const demoRef = ref<HTMLDivElement | null>(null);

// 创建场景、相机和渲染器
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 5, 8);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0.5, 0);
scene.add(mesh);

const grid = new THREE.GridHelper(10, 10, 0x111111, 0x111111);
scene.add(grid);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// Init Gizmo with OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
const gizmo = new ViewportGizmo(camera, renderer);
gizmo.attachControls(controls);

function animation(time) {
  renderer.render(scene, camera);
  gizmo.render();
}

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  gizmo.update();
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<style scoped></style>
