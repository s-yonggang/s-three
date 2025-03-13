import * as THREE from 'three';
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
  computeBatchedBoundsTree,
  disposeBatchedBoundsTree,
  MeshBVHHelper,
  CENTER,
  MeshBVH
} from 'three-mesh-bvh';
import { GUI } from "lil-gui";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 添加扩展函数
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;

async function createModels(stats) {
  const group = new THREE.Group();


  const verterx1 = new Float32Array([1, 1, 1]);
  const pointGeometry1 = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(verterx1, 3));
  const pointMesh1 = new THREE.Points(pointGeometry1, new THREE.PointsMaterial({color: 0xff0000}));

  const verterx2 = new Float32Array([-1, -1, -1]);
  const pointGeometry2 = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(verterx2, 3));
  const pointMesh2 = new THREE.Points(pointGeometry2, new THREE.PointsMaterial({color: 0xff0000}));


  group.add(pointMesh1,pointMesh2)

  // 动画
  pointMesh1.tick = (delta: number, deltaTime: number) => {

  }
  // 销毁
  const onDestroy = () => {

  }

  return { group, onDestroy };
}
export { createModels }
