<template>
  <div ref="demoRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from 'three';
import {
  acceleratedRaycast, computeBoundsTree, disposeBoundsTree,
} from 'three-mesh-bvh';
const demoRef = ref<HTMLDivElement | null>(null);
// 添加扩展函数
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建几何体和材质
const geometry = new THREE.TorusKnotGeometry(10, 3, 400, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 计算 BVH
geometry.computeBoundsTree();

// 设置相机位置
camera.position.z = 50;

// 创建射线投射器
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;

// 创建鼠标事件监听器
window.addEventListener('click', (event) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(mouse)
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0) {
    console.log('Hit:', intersects[0].object.material);
    // intersects[0].object
    intersects[0].object.material.color.set(0xff0000);
  }
});

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

onMounted(() => {});

onUnmounted(() => {});

</script>

<style scoped></style>
