import {
  PlaneGeometry,
  BoxGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  BufferGeometry,
  Vector3,
  Euler,
  TorusKnotGeometry,
  MeshPhongMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Matrix4,
  Box3
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree, MeshBVHHelper, MeshBVH, AVERAGE } from 'three-mesh-bvh';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

async function createModels(camera: any, renderer: any, controls: any) {

  Mesh.prototype.raycast = acceleratedRaycast;
  BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

  const params = {
    speed: 1,
    visualizeBounds: false,
    visualBoundsDepth: 10,
    shape: 'sphere',
    position: new Vector3(0, 0, 0),
    rotation: new Euler(),
    scale: new Vector3(1, 1, 1),
  };

  // 创建几何体
  const knotGeometry = new BoxGeometry(4, 4, 4);
  const material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
    opacity: 0.5,
    transparent: true,
    premultipliedAlpha: true,
    wireframe: true,
  });
  const targetMesh: any = new Mesh(knotGeometry, material);


  // 使用 AVERAGE 分割策略创建 BVH
  const bvh = new MeshBVH(targetMesh.geometry, { strategy: AVERAGE });
  // 将 BVH 分配给几何体
  targetMesh.geometry.boundsTree = bvh;

  // // 创建包围盒
  // targetMesh.geometry.computeBoundsTree();

  // 创建几何体移动控制器
  const dragBoxControl = new TransformControls(camera, renderer.domElement);
  dragBoxControl.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;

  });
  dragBoxControl.attach(targetMesh);


  // 创建检测几何体
  const shapeMaterial = new MeshStandardMaterial({
    metalness: 0.1,
    transparent: true,
    opacity: 0.8,
    premultipliedAlpha: true,
    side: DoubleSide,
  });
  const meshBox = new Mesh(new BoxGeometry(1, 1, 1), shapeMaterial);
  const group = new Group()
  group.add(targetMesh, meshBox, dragBoxControl.getHelper());

  // animation
  targetMesh.tick = (delta: number, deltaTime: any) => {

    targetMesh.rotation.y += params.speed * delta * 0.1;
    targetMesh.updateMatrixWorld();

    // meshBox.visible = true;
    meshBox.position.copy(params.position);
    meshBox.rotation.copy(params.rotation);
    meshBox.scale.copy(params.scale);

    const transformMatrix = new Matrix4().copy(targetMesh.matrixWorld).invert().multiply(meshBox.matrixWorld);

    // 轴对称包围盒
    const box = new Box3();
    box.min.set(- 0.5, - 0.5, - 0.5);
    box.max.set(0.5, 0.5, 0.5);

    const hit = targetMesh.geometry.boundsTree.intersectsBox(box, transformMatrix);

    if (hit) {
      console.log(`是否相较：${hit}`)
    }
    meshBox.material.color.set(hit ? 0xE91E63 : 0x666666);
    meshBox.material.emissive.set(0xE91E63).multiplyScalar(hit ? 0.25 : 0);
  }

  const onDestroy = () => {
    dragBoxControl.detach();
    dragBoxControl.dispose();

    targetMesh.geometry.dispose();
    targetMesh.material.dispose();
    // targetMesh.disposeBoundsTree();
    meshBox.geometry.dispose();
    meshBox.material.dispose();
    group.remove(targetMesh);
    group.remove(meshBox);
    group.remove(dragBoxControl.getHelper());
    targetMesh.geometry.boundsTree = null;
  }
  return { group, onDestroy };
}

export { createModels }
