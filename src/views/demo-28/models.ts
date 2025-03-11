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
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

function randomizeMatrix(matrix: THREE.Matrix4) {
  const position = new THREE.Vector3(
    Math.random() * 20 - 10,
    Math.random() * 20 - 10,
    Math.random() * 20 - 10
  );
  const rotation = new THREE.Euler(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI
  );
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  const scale = new THREE.Vector3(
    0.5 + Math.random() * 0.5,
    0.5 + Math.random() * 0.5,
    0.5 + Math.random() * 0.5
  );
  return matrix.compose(position, quaternion, scale);
}


// 添加扩展函数
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;

async function createModels() {

  // ----------------------------单个何体 使用bvh-----------------------------

  // const geom = new THREE.SphereGeometry(1, 32, 32);
  // const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({}));

  // 方式一
  // geom.computeBoundsTree({
  //   strategy: 1,            // 使用中心策略
  //   maxDepth: 40,    // 最大深度
  //   maxLeafTris: 10,             // 每个叶子节点的最大三角形数
  //   setBoundingBox: true,        // 设置边界框
  //   useSharedArrayBuffer: false, // 是否使用共享数组缓冲区
  //   verbose: true,               // 是否输出详细信息
  //   onProgress: (progress) => {
  //     console.log(`Progress: ${progress * 100}%`); // 进度回调
  //   },
  //   range: {
  //     start: 0,
  //     count: geom.index ? geom.index.count : geom.attributes.position.count // 范围
  //   }
  // });
  // const helper = new MeshBVHHelper(mesh, 40) // 辅助线

  // 方式二
  // const bvh = new MeshBVH(geom, {
  //   strategy: 1,                 // 使用中心策略
  //   maxDepth: 40,                // 最大深度
  //   maxLeafTris: 10,             // 每个叶子节点的最大三角形数
  //   setBoundingBox: true,        // 设置边界框
  //   useSharedArrayBuffer: false, // 是否使用共享数组缓冲区
  //   verbose: true,               // 是否输出详细信息
  //   onProgress: (progress) => {
  //     console.log(`Progress: ${progress * 100}%`); // 进度回调
  //   },
  //   range: {
  //     start: 0,
  //     count: geom.index ? geom.index.count : geom.attributes.position.count // 范围
  //   }
  // })
  // geom.boundsTree = bvh;
  // const helper = new MeshBVHHelper(mesh, 40) // 辅助线
  // ------------------------------------------------------------------



  // -------------------或者生成批处理网格并计算其 BVH -------------------

  // 材质
  // const material = new THREE.MeshBasicMaterial({});
  // const boxGeo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
  // const sphereGeo = new THREE.SphereGeometry(1.2, 32, 32);
  // const torusGeo = new THREE.TorusGeometry(2, 0.4, 16, 32);
  // const maxVertexCount = boxGeo.attributes.position.count + sphereGeo.attributes.position.count + torusGeo.attributes.position.count;
  // const maxIndexCount = (boxGeo.index ? boxGeo.index.count : 0) + (sphereGeo.index ? sphereGeo.index.count : 0) + (torusGeo.index ? torusGeo.index.count : 0);
  // const batchedMesh = new THREE.BatchedMesh(100, maxVertexCount, maxIndexCount, material);
  // const geometries = [boxGeo, sphereGeo, torusGeo];
  // const geometryIds = geometries.map(geometry => batchedMesh.addGeometry(geometry));
  // for (let i = 0; i < 20; i++) {
  //   batchedMesh.addInstance(geometryIds[i % geometryIds.length])
  //   batchedMesh.setMatrixAt(i, randomizeMatrix(new THREE.Matrix4())); // 设置位置
  // }
  // batchedMesh.computeBoundsTree(geometryIds[20]);
  // console.log(batchedMesh);
  // ------------------------------------------------------------------


  //
  // ----------------------------合并几何体-----------------------------

  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  const [A] = await Promise.all([
    loader.loadAsync('./models/gears.glb'),
  ]);

  // 将模型合并处理
  const geometries: any = [];
  A.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.updateMatrixWorld = true;
      const geometry = child.geometry.clone();
      geometry.applyMatrix4(child.matrixWorld)
      geometries.push(geometry);
    }
  });
  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);

  const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const mesh = new THREE.Mesh(mergedGeometry, material);
  mergedGeometry.computeBoundsTree({
    strategy: CENTER,
    maxDepth: 40,
    maxLeafTris: 10,
    verbose: true,
    setBoundingBox: true,
    useSharedArrayBuffer: false,
    onProgress: (progress) => {
      console.log(`Progress: ${progress * 100}%`);
    },
    // range: {
    //   start: 0,
    //   count: mergedGeometry.index ? mergedGeometry.index.count : mergedGeometry.attributes.position.count
    // }
  }
  );
  const helper = new MeshBVHHelper(mesh, 40) // 辅助线
  // ------------------------------------------------------------------

  const group = new THREE.Group();
  group.add(mesh, helper);

  mesh.tick = (delta, deltaTime) => { }

  const onDestroy = () => { }
  return { group, onDestroy };
}
export { createModels }
