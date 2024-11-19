import {
  SphereGeometry,
  PointsMaterial,
  BoxGeometry,
  ShaderMaterial,
  Uniform,
  Vector2,
  Group,
  Points,
  AdditiveBlending,
  BufferAttribute,
  Float32BufferAttribute,
  BufferGeometry
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import vertexShader from "./models_vt.glsl";
import fragmentShader from "./models_gm.glsl";
import GUI from 'lil-gui';
import gsap from 'gsap';

async function createModels(container: any) {
  const sizes = {
    width: container.clientWidth,
    height: container.clientHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }
  const particles: any = {};

  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('src/assets/draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  const [modelA, modelB, modelC, modelD] = await Promise.all([
    loader.loadAsync('src/assets/models/model.gltf'),
    loader.loadAsync('src/assets/models/model11.gltf'),
    loader.loadAsync('src/assets/models/model1.gltf'),
    loader.loadAsync('src/assets/models/model10.gltf'),
  ]);
  console.log(modelD.scene)

  const A = modelA.scene.children[0].children[0].geometry;
  const B = modelB.scene.children[0].geometry;
  const C = modelC.scene.children[0].geometry;
  const D = modelD.scene.children[0].geometry;
  const positions = [A, B, C, D].map(item => item.attributes.position);




  particles.maxCount = 0;
  for (const position of positions) {
    if (position.count > particles.maxCount) {
      particles.maxCount = position.count;
    }
  }

  particles.positions = [];
  particles.index = 0;

  for (const position of positions) {
    const originArray = position.array;
    const newArray = new Float32Array(particles.maxCount * 3)

    for (let i = 0; i < particles.maxCount; i++) {
      const i3 = i * 3;
      if (i3 <= originArray.length) {
        newArray[i3 + 0] = originArray[i3 + 0];
        newArray[i3 + 1] = originArray[i3 + 1];
        newArray[i3 + 2] = originArray[i3 + 2];
      } else {
        const randomIndex = Math.floor(position.count * Math.random()) * 3;
        newArray[i3 + 0] = originArray[randomIndex + 0];
        newArray[i3 + 1] = originArray[randomIndex + 1];
        newArray[i3 + 2] = originArray[randomIndex + 2];
        // newArray[i3 + 0] = 0;
        // newArray[i3 + 1] = 1;
        // newArray[i3 + 2] = 0;
      }
    }
    particles.positions.push(new Float32BufferAttribute(newArray, 3))
  }
  console.log(particles.positions)
  particles.geometry = new BufferGeometry();
  particles.geometry.computeBoundingSphere();
  particles.geometry.setAttribute('position', particles.positions[particles.index]);
  particles.geometry.setAttribute('aPositionTarget', particles.positions[1]);
  particles.geometry.setIndex(null);
  particles.material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uSize: new Uniform(0.01),
      uResolution: new Uniform(new Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
      uProgress: new Uniform(0)
    },
    blending: AdditiveBlending,
    depthWrite: false
  });


  particles.points = new Points(particles.geometry, particles.material);
  // particles.points.position.y = -1

  particles.morgh = (index: number) => {
    particles.geometry.setAttribute('position', particles.positions[particles.index]);
    particles.geometry.setAttribute('aPositionTarget', particles.positions[index]);
    gsap.fromTo(particles.material.uniforms.uProgress, { value: 0 }, { value: 1, duration: 3, ease: 'ease-in-out' });

    particles.index = index;
  }
  particles.morgh0 = () => { particles.morgh(0) };
  particles.morgh1 = () => { particles.morgh(1) };
  particles.morgh2 = () => { particles.morgh(2) };
  particles.morgh3 = () => { particles.morgh(3) };


  const gui = new GUI();
  gui.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001);
  gui.add(particles, 'morgh0');
  gui.add(particles, 'morgh1');
  gui.add(particles, 'morgh2');
  gui.add(particles, 'morgh3');

  // console.log(particles.geometry)
  // animation
  // const radiansPerSecond = MathUtils.degToRad(10);
  // models.tick = (delta: any, deltaTime: any) => {
  //   // console.log(deltaTime)
  // }

  const gorups = new Group();
  gorups.add(particles.points);
  return { gorups };
}

export { createModels }
