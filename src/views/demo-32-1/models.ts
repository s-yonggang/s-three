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

  // 创建模拟的射线
  const raycaster = new THREE.Raycaster();
  const sphere = new THREE.SphereGeometry(0.25, 20, 20);
  const cylinder = new THREE.CylinderGeometry(0.05, 0.05);
  const pointDist = 40;
  const rayCasterObjects: Array<any> = []

  // gui 控制参数
  const params = {
    animate: {
      delta: 0,
      stop: false,
    },

    raycasters: {
      count: 100,
      speed: 1,
      near: 0,
      far: pointDist
    },
    mesh: {
      // strategy: CENTER,
      strategy: 0,
      count: 1,
      visualBoundsDepth: 10,
      speed: 1,
      useBoundsTree: true,
      displayParents: false,
      boundsHelperVisible: false
    }
  }

  // 主体几何体
  interface extendsObject3D extends THREE.Object3D {
    tick?: (delta: number, deltaTime: number) => void;
  }
  const containerObj: extendsObject3D = new THREE.Object3D();
  const geometry: any = new THREE.TorusKnotGeometry(1, 0.4, 400, 100);
  const material = new THREE.MeshPhongMaterial({ color: 0xD12345 });
  containerObj.scale.multiplyScalar(10);
  // containerObj.rotation.x = 10.989999999999943;
  // containerObj.rotation.y = 10.989999999999943;
  const mesh = new THREE.Mesh(geometry, material);

  containerObj.add(mesh);
  // 添加射线
  function addRaycaster() {
    const rayObj = new THREE.Object3D();
    const rayMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
    const origMesh = new THREE.Mesh(sphere, rayMaterial); // 光原
    const hitMesh = new THREE.Mesh(sphere, rayMaterial); // 交点
    hitMesh.scale.multiplyScalar(0.5)
    const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
    rayObj.add(origMesh, hitMesh, cylinderMesh);
    group.add(rayObj);

    // set transforms
    origMesh.position.set(pointDist, 0, 0);
    rayObj.rotation.x = Math.random() * 10;
    rayObj.rotation.y = Math.random() * 10;
    rayObj.rotation.z = Math.random() * 10;

    // reusable vectors
    const origV3 = new THREE.Vector3();
    const hitV3 = new THREE.Vector3();
    const dirX = (Math.random() - 0.5);
    const dirY = (Math.random() - 0.5);
    const dirZ = (Math.random() - 0.5);

    // 计算交点位置
    function computeHihPosition() {
      origMesh.updateMatrixWorld();
      origV3.setFromMatrixPosition(origMesh.matrixWorld);
      hitV3.copy(origV3).multiplyScalar(-1).normalize();

      raycaster.set(origV3, hitV3);
      raycaster.firstHitOnly = true;
      const hit = raycaster.intersectObject(containerObj, true);
      const length = hit.length ? hit[0].distance : pointDist;

      hitMesh.position.set(pointDist - length, 0, 0);
      const lineLength = hit.length ? length - raycaster.near : length - raycaster.near - (pointDist - raycaster.far);

      cylinderMesh.position.set(pointDist - raycaster.near - (lineLength / 2), 0, 0);
      cylinderMesh.scale.set(1, lineLength, 1);
      cylinderMesh.rotation.z = Math.PI / 2;
    }

    // computeHihPosition();

    rayCasterObjects.push({
      update: (delta: number) => {
        rayObj.rotation.x += dirX * 0.1 * params.raycasters.speed * delta;
        rayObj.rotation.y += dirY * 0.1 * params.raycasters.speed * delta;
        rayObj.rotation.z += dirZ * 0.1 * params.raycasters.speed * delta;

        computeHihPosition();
      },
      remove: () => {
        group.remove(rayObj)
      }
    })
  }

  let boundsHelper: any = null;

  function updateFrame() {

    // 更新是否使用bvh
    // if (
    //   !params.mesh.useBoundsTree && geometry.boundsTree ||
    //   geometry.boundsTree && params.mesh.strategy !== geometry.boundsTree.strategy
    // ) {
    //   geometry.disposeBoundsTree();
    // }
    if (params.mesh.useBoundsTree && !geometry.boundsTree) {
      console.time('computing bounds tree');
      geometry.computeBoundsTree({
        maxLeafTris: 10,
        strategy: params.mesh.strategy
      });
      geometry.boundsTree.splitStrategy = params.mesh.strategy;
      console.timeEnd('computing bounds tree');

      if (boundsHelper) {
        boundsHelper.update();
      }
    }

    // 更新 BVH 辅助线
    const shouldDisplayBounds = params.mesh.boundsHelperVisible && geometry.boundsTree;
    if (boundsHelper && !shouldDisplayBounds) {
      containerObj.remove(boundsHelper);
      boundsHelper = null;
    }
    if (!boundsHelper && shouldDisplayBounds) {
      boundsHelper = new MeshBVHHelper(mesh);
      containerObj.add(boundsHelper);
    }
    if (boundsHelper) {
      boundsHelper.depth = params.mesh.visualBoundsDepth;
      boundsHelper.displayParents = params.mesh.displayParents;
      boundsHelper.update();
    }

    raycaster.near = params.raycasters?.near;
    raycaster.far = params.raycasters?.far;

    // 更新射线数量
    while (rayCasterObjects.length > params.raycasters.count) {
      rayCasterObjects.pop().remove();
    }
    while (rayCasterObjects.length < params.raycasters.count) {
      addRaycaster();
    }
    if (!geometry) {
      return;
    }
  }

  // gui
  const gui = new GUI()
  gui.add(params.mesh, 'boundsHelperVisible').onChange((val: boolean) => {
    updateFrame()
    ctr1[val ? 'show' : 'hide']();
    ctr2[val ? 'show' : 'hide']();
  });
  const ctr1 = gui.add(params.mesh, 'displayParents').onChange(() => updateFrame()).hide();
  const ctr2 = gui.add(params.mesh, 'visualBoundsDepth', 1, 40, 1).onChange(() => updateFrame()).hide();

  gui.add(params.raycasters, 'count', 1, 1000, 1).onChange(() => updateFrame()).name('rayCount')
  gui.add(params.animate, 'stop').name('animateStop')
  // 加入
  group.add(containerObj);
  updateFrame()

  // 动画
  containerObj.tick = (delta: number, deltaTime: number) => {
    params.animate.delta = params.animate.stop ? 0 : delta;
    rayCasterObjects.forEach(f => f.update(params.animate.delta));
    containerObj.rotation.x += params.mesh.speed * params.animate.delta * 0.2;
    containerObj.rotation.y += params.mesh.speed * params.animate.delta * 0.2;
    containerObj.children.forEach(c => {
      c.rotation.x += 0.001 * params.mesh.speed * params.animate.delta;
      c.rotation.y += 0.001 * params.mesh.speed * params.animate.delta;
    });
    stats.update()
  }
  // 销毁
  const onDestroy = () => {
    rayCasterObjects.forEach(f => f.remove());
    rayCasterObjects.length = 0;

    if (boundsHelper) {
      group.remove(boundsHelper);
      boundsHelper = null;
    }
    group.clear();
    gui.destroy();

    geometry.disposeBoundsTree();
    geometry.dispose();
  }

  return { group, onDestroy };
}
export { createModels }
