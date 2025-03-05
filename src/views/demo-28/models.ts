import * as THREE from 'three';
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
  computeBatchedBoundsTree,
  disposeBatchedBoundsTree,
  MeshBVHHelper,
  CENTER
} from 'three-mesh-bvh';

// const params = {}

// 添加扩展函数
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;

async function createModels() {

  // ----------------------------创建几何体-----------------------------
  const geom = new THREE.SphereGeometry(1, 32, 32);
  const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({}));
  // 计算几何体的 BVH
  geom.computeBoundsTree({
    strategy: 1,            // 使用中心策略
    maxDepth: 40,    // 最大深度
    maxLeafTris: 10,             // 每个叶子节点的最大三角形数
    setBoundingBox: true,        // 设置边界框
    useSharedArrayBuffer: false, // 是否使用共享数组缓冲区
    verbose: true,               // 是否输出详细信息
    onProgress: (progress) => {
      console.log(`Progress: ${progress * 100}%`); // 进度回调
    },
    range: {
      start: 0,
      count: geom.index ? geom.index.count : geom.attributes.position.count // 范围
    }
  });
  const helper = new MeshBVHHelper(mesh, 40) // 辅助线
  // ------------------------------------------------------------------



  // -------------------或者生成批处理网格并计算其 BVH -------------------

  // // 材质
  // const material = new THREE.MeshBasicMaterial({});
  // // 几何体
  // const geometries = [
  //   new THREE.BoxGeometry(2.0, 2.0, 2.0),
  //   new THREE.SphereGeometry(1.0, 16, 16),
  // ];

  // // 批处理网格设置
  // const geometryCount = 10;
  // const vertexCount = geometries.length * 512;
  // const indexCount = geometries.length * 1024;
  // const batchedMesh = new THREE.BatchedMesh(geometryCount, vertexCount, indexCount, material);
  // // mesh.perObjectFrustumCulled = false;

  // // 将几何体添加到批处理网格
  // const matrix = new THREE.Matrix4();
  // const geometryIds = geometries.map(geometry => batchedMesh.addGeometry(geometry));

  // for (let i = 0; i < 10; i++) {
  //   batchedMesh.addInstance(geometryIds[i % geometryIds.length])
  //   batchedMesh.setMatrixAt(i, randomizeMatrix(matrix)); // 设置位置
  // }

  // batchedMesh.computeBoundsTree(geometryIds[geometries.length], {
  //   strategy: CENTER,            // 使用中心策略
  //   maxDepth: 60,                // 最大深度
  //   maxLeafTris: 2,              // 每个叶子节点的最大三角形数
  //   setBoundingBox: true,        // 设置边界框
  //   useSharedArrayBuffer: false, // 是否使用共享数组缓冲区
  //   verbose: true,               // 是否输出详细信息
  //   onProgress: (progress) => {
  //     // console.log(`Progress: ${progress * 100}%`); // 进度回调
  //   },
  // });
  // console.log(batchedMesh);
  // const helper = new MeshBVHHelper(batchedMesh, 60)



  // function randomizeMatrix(matrix: THREE.Matrix4) {
  //   const position = new THREE.Vector3(
  //     Math.random() * 20 - 10,
  //     Math.random() * 20 - 10,
  //     Math.random() * 20 - 10
  //   );
  //   const rotation = new THREE.Euler(
  //     Math.random() * 2 * Math.PI,
  //     Math.random() * 2 * Math.PI,
  //     Math.random() * 2 * Math.PI
  //   );
  //   const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  //   const scale = new THREE.Vector3(
  //     0.5 + Math.random() * 0.5,
  //     0.5 + Math.random() * 0.5,
  //     0.5 + Math.random() * 0.5
  //   );

  //   return matrix.compose(position, quaternion, scale);
  // }


  // 为子几何体生成边界树
  // const helper = new MeshBVHHelper(mesh, 40); // 辅助线
  // -------------------------------------------------------------------


  // Geometry and Material
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });

  // // BatchedMesh
  // const batchedMesh = new THREE.BatchedMesh(10000, 1000, 1000, material);
  // const geometryId = batchedMesh.addGeometry(geometry);
  // const mesh = new THREE.Mesh(geometry, material);
  // for (let i = 0; i < 10000; i++) {
  //   mesh.position.set(
  //     Math.random() * 10 - 5,
  //     Math.random() * 10 - 5,
  //     Math.random() * 10 - 5
  //   );
  //   mesh.updateMatrix();
  //   batchedMesh.addInstance(geometryId);
  //   batchedMesh.setMatrixAt(i, mesh.matrix);
  // }
  // batchedMesh.computeBoundsTree();
  // // Helper
  // const helper = new MeshBVHHelper(new THREE.Mesh(),10);
  // // helper.update()
  // // helper.visible = true;



  const group = new THREE.Group();
  group.add(mesh,helper);

  mesh.tick = (delta, deltaTime) => { }

  const onDestroy = () => {}
  return { group, onDestroy };
}
export { createModels }
