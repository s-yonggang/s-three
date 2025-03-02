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
  Box3,
  // Sin
} from "three";
import GUI from "lil-gui";
// import vertex from "./vertex.glsl";
// import fragment from "./fragment.glsl";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree, MeshBVHHelper, MeshBVH, AVERAGE, CONTAINED, INTERSECTED } from 'three-mesh-bvh';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import gsap from 'gsap';

async function createModels(camera: any, renderer: any, controls: any) {

  // 添加扩展函数
  Mesh.prototype.raycast = acceleratedRaycast;
  BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

  // 外部几何体
  const outerGeometry = new BoxGeometry(4, 4, 4);
  const outerMaterial = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
    opacity: 0.2,
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false, // 关键：关闭深度写入
    // wireframe: true,
  });
  const outerBox: any = new Mesh(outerGeometry, outerMaterial);
  outerBox.renderOrder = 1; // 默认物体 renderOrder 为 0，设为更高值确保后渲染

  // 创建几何体移动控制器
  const dragBoxControl = new TransformControls(camera, renderer.domElement);
  dragBoxControl.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
  });
  dragBoxControl.attach(outerBox);
  // dragBoxControl.showX = false
  // dragBoxControl.showY = false
  // dragBoxControl.showZ = false
  dragBoxControl.size = 0.5

  // 内部几何体
  const innerMaterial = new MeshStandardMaterial({
    metalness: 0.1,
    transparent: true,
    opacity: 0.8,
    premultipliedAlpha: true,
    side: DoubleSide,
  });
  const innerGeometry = new SphereGeometry(0.5, 32, 32);
  const innerBox = new Mesh(innerGeometry, innerMaterial);
  innerBox.position.set(0, 0, -4);
  // 计算 BVH
  gsap.to(innerBox.position, {
    z: 5,                   // 横向移动 300px
    duration: 2,            // 动画时长
    repeat: -1,             // 无限重复
    yoyo: true,             // 每次重复反向播放
    ease: "power4.inOut",   // 缓动函数
  });

  outerGeometry.computeBoundsTree();
  innerGeometry.computeBoundsTree();

  let meshBVHHelper:any = new MeshBVHHelper(outerBox, 100);

  const group = new Group()
  group.add(outerBox, innerBox, dragBoxControl.getHelper(), meshBVHHelper);

  const params = {
    position: new Vector3(0, 0, 0),
    rotation: new Euler(),
    scale: new Vector3(1, 1, 1),
  }

  /**
   * 1. 检测内部几何体是否在外部几何体内
   * 2. 检测内部几何体是否与外部几何体相交
   */
  const inspectionInOut = () => {
    let hit1: boolean = false;
    let hit2: boolean = false;
    // outerBox.updateMatrixWorld();
    // innerBox.updateMatrixWorld();
    const testBBox = new Box3().setFromObject(innerBox);
    const containerBBox = new Box3().setFromObject(outerBox);
    hit1 = containerBBox.containsBox(testBBox);
    if (!hit1) {
      innerBox.position.copy(innerBox.position);
      innerBox.rotation.copy(innerBox.rotation);
      innerBox.scale.copy(innerBox.scale);
      const transformMatrix = new Matrix4().copy(outerBox.matrixWorld).invert().multiply(innerBox.matrixWorld);
      // 轴对称包围盒
      const box = new Box3();
      box.min.set(- 0.2, - 0.2, - 0.2);
      box.max.set(0.2, 0.2, 0.2);
      hit2 = outerBox.geometry.boundsTree.intersectsGeometry(innerBox.geometry, transformMatrix);
    }
    innerBox.material.color.set(hit1 || hit2 ? 0xE91E63 : 0x666666);
    innerBox.material.emissive.set(0xE91E63).multiplyScalar(hit1 || hit2 ? 0.25 : 0);
  }

  // animation
  outerBox.tick = (delta: number, deltaTime: any) => {
    inspectionInOut();
  }

  const onDestroy = () => {
    outerGeometry.dispose();
    innerGeometry.dispose();
    outerMaterial.dispose();
    innerMaterial.dispose();
    outerBox.geometry.dispose();
    innerBox.geometry.dispose();
    dragBoxControl.dispose();
    meshBVHHelper = null;

    outerGeometry.disposeBoundsTree();
    innerGeometry.disposeBoundsTree();
    outerBox.geometry.boundsTree = null;
    group.remove(outerBox, innerBox, dragBoxControl.getHelper(), meshBVHHelper);
  }
  return { group, onDestroy };
}

export { createModels }
