<template>
  <div ref="demoRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {
  MeshBVH,
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
  INTERSECTED,
  NOT_INTERSECTED,
  CONTAINED,
} from 'three-mesh-bvh';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const demoRef = ref<HTMLDivElement | null>(null);
// 添加扩展函数
THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.add(orbitControls.target);
orbitControls.update();
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建外部几何体
const outerGeometry = new THREE.BoxGeometry(5, 5, 5);
const outerMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.5,
  depthWrite: false,
});
const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
scene.add(outerMesh);

// 创建内部几何体
const innerGeometry = new THREE.SphereGeometry(1, 32, 32);
const innerMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 1.0,
  depthWrite: true,
});
const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
scene.add(innerMesh);

// 计算 BVH
outerGeometry.computeBoundsTree();
innerGeometry.computeBoundsTree();

// 设置相机位置
camera.position.z = 10;

// 判断几何体是否在另一个几何体内部
function isGeometryContained(outerMesh, innerMesh) {
  const matrix = new THREE.Matrix4().identity();
  let isContained = true;

  outerMesh.geometry.boundsTree.shapecast({
    intersectsBounds: box => {
      return CONTAINED;
    },
    intersectsTriangle: tri => {
      tri.a.applyMatrix4(matrix);
      tri.b.applyMatrix4(matrix);
      tri.c.applyMatrix4(matrix);
      tri.needsUpdate = true;

      innerMesh.geometry.boundsTree.shapecast({
        intersectsBounds: innerBox => {
          return INTERSECTED;
        },
        intersectsTriangle: innerTri => {
          if (
            innerTri.a.equals(tri.a) ||
            innerTri.b.equals(tri.b) ||
            innerTri.c.equals(tri.c)
          ) {
            isContained = false;
            return false;
          }
          return undefined;
        },
      });

      if (!isContained) return false;
      return undefined;
    },
  });

  return isContained;
}

// 检测几何体是否包含
const contained = isGeometryContained(outerMesh, innerMesh);
console.log('内部几何体是否完全包含在外部几何体中:', contained);

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
