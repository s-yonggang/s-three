import {
  Group
} from "three";
// import { createLabelDiv, createLabelLine } from '@/components/WorldLabelRenderer'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import url from "@/assets/images/sprite.png";
// import model1 from "@/assets/models/model1.gltf";
// import model2 from "@/assets/models/model2.gltf";
// import model3 from "@/assets/models/model3.gltf";

function createModels() {
  const particlesTotal: number = 512;
  const positions: any = [];
  const objects: any = [];
  let current: number = 0;
  const particlesGroup: any = new Group();

  // Plane
  const amountX = 16;
  const amountZ = 32;
  const separationPlane = 150;
  const offsetX = ((amountX - 1) * separationPlane) / 2;
  const offsetZ = ((amountZ - 1) * separationPlane) / 2;
  for (let i = 0; i < particlesTotal; i++) {
    const x = (i % amountX) * separationPlane;
    const z = Math.floor(i / amountX) * separationPlane;
    const y = (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200;
    positions.push(x - offsetX, y, z - offsetZ);
  }

  // Cube
  const amount = 8;
  const separationCube = 150;
  const offset = ((amount - 1) * separationCube) / 2;
  for (let i = 0; i < particlesTotal; i++) {
    const x = (i % amount) * separationCube;
    const y = Math.floor((i / amount) % amount) * separationCube;
    const z = Math.floor(i / (amount * amount)) * separationCube;
    positions.push(x - offset, y - offset, z - offset);
  }
  // // Random
  // for (let i = 0; i < particlesTotal; i++) {
  //   positions.push(
  //     Math.random() * 4000 - 2000,
  //     Math.random() * 4000 - 2000,
  //     Math.random() * 4000 - 2000
  //   );
  // }

  // Sphere
  const radius = 750;
  for (let i = 0; i < particlesTotal; i++) {
    const phi = Math.acos(- 1 + (2 * i) / particlesTotal);
    const theta = Math.sqrt(particlesTotal * Math.PI) * phi;
    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }
  /**
   * gltf-格式-模型压缩
   */
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath('src/assets/draco/gltf/');

  // const gltfLoader = new GLTFLoader();
  // gltfLoader.setDRACOLoader(dracoLoader);

  // model1
  // gltfLoader.load('src/assets/models/model1.gltf', (gltf) => {
  //   gltf.scene.children.map((child: any) => {
  //     console.log(child.geometry.attributes.position.array)

  //   })
  // })


  const image: any = document.createElement('img');
  image.addEventListener('load', () => {
    image.width = 20;
    image.height = 20;
    for (let i = 0; i < particlesTotal; i++) {
      const object: any = new CSS3DSprite(image.cloneNode());
      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 1000 - 500;
      object.position.z = Math.random() * 1000 - 500;
      particlesGroup.add(object);
      objects.push(object);
    }
    transition();
  })
  image.src = url;

  function transition() {
    const offset = current * particlesTotal * 3;
    const duration = 2000;
    for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {
      const object: any = objects[i];
      new TWEEN.Tween(object.position)
        .to({
          x: positions[j],
          y: positions[j + 1],
          z: positions[j + 2]
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }
    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onComplete(transition)
      .start();
    current = (current + 1) % 4;
  }

  // animation
  // const radiansPerSecond = MathUtils.degToRad(10);
  particlesGroup.tick = (delta: any, deltaTime: any) => {
    TWEEN.update();
    // console.log(deltaTime)
    // uniforms.uTime.value = deltaTime;
    // console.log(uniforms.uTime.value)
    // terrain.rotation.x += radiansPerSecond * delta;
    // terrain.rotation.y += radiansPerSecond * delta;
    // terrain.rotation.z += radiansPerSecond * delta;
  }
  return { particlesGroup };
}

export { createModels }
