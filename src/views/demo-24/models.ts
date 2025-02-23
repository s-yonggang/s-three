import {
  PlaneGeometry,
  BoxGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  TubeGeometry,
  Curve,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  WebGLRenderTarget,
  PerspectiveCamera,
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
async function createModels(container, camera) {
  console.log(Reflector);
  // 1. 定义半圆形路径
  class SemiCirclePath extends Curve {
    radius: number;
    constructor(radius: number) {
      super();
      this.radius = radius;
    }
    getPoint(t) {
      const angle = Math.PI * t; // t 范围 [0, 1]，对应角度 [0, π]
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);
      return new Vector3(x, y, 0);
    }
  }
  const radius = 0.8; // 路径半径
  const path: any = new SemiCirclePath(radius);
  // 2. 生成管道几何体
  const tubularSegments = 64; // 管道分段数
  const radialSegments = 16;  // 截面分段数
  const tubeRadius = 0.05;     // 管道截面半径

  const geometry = new TubeGeometry(
    path,
    tubularSegments,
    tubeRadius,
    radialSegments,
    false // 是否闭合路径
  );
  const material = new MeshStandardMaterial({ color: 0xffffff });
  const pipe = new Mesh(geometry, material);
  const pipe1 = pipe.clone();
  pipe1.position.z = 2;


  const planeGeometry = new PlaneGeometry(2, 10)
  const mesh = new Reflector(planeGeometry, {
    clipBias: 0.03,
    textureWidth: container.clientWidth * window.devicePixelRatio,
    textureHeight: container.clientHeight * window.devicePixelRatio,
    color: 0xffffff
  })
  mesh.rotateX(- Math.PI / 2);

  const planeGeometry1 = new PlaneGeometry(10, 10)
  const planeMateral1 = new MeshPhysicalMaterial( {
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
      side: DoubleSide,
    })
  const mesh1 = new Mesh(planeGeometry1, planeMateral1)
  mesh1.rotateY(- Math.PI / 2);
  mesh1.position.x = 2
  const mesh2 = new Mesh(planeGeometry1, planeMateral1)
  mesh2.rotateY(- Math.PI / 2);
  mesh2.position.x = -2

  const group = new Group();
  group.add(mesh,mesh1,mesh2, pipe, pipe1);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
