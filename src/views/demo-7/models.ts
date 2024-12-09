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
  BufferGeometry,
  Color
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
  particles.colorA = '#7a3700';
  particles.colorB = '#0099ff';

  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();

  loader.setDRACOLoader(dracoLoader);
  const [modelA, modelB, modelC, modelD, modelE] = await Promise.all([
    loader.loadAsync('./models/model_1.glb'),
    loader.loadAsync('./models/model_2.glb'),
    loader.loadAsync('./models/model_3.glb'),
    loader.loadAsync('./models/model_4.glb'),
    loader.loadAsync('./models/model_5.glb'),
  ]);
  console.log(modelD.scene.children[0].children[0].geometry, '+++')


  const A = modelA.scene.children[0].children[0].geometry;
  const B = modelB.scene.children[0].children[0].geometry;
  const C = modelC.scene.children[0].children[0].geometry;
  const D = modelD.scene.children[0].children[0].geometry;
  const E = modelE.scene.children[0].children[0].geometry;
  const positions = [A, B, C, D, E].map(item => item.attributes.position);

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
  const sizeArray = new Float32Array(particles.maxCount);
  for (let i = 0; i < particles.maxCount; i++) {
    // sizeArray[i] = Math.random();
    sizeArray[i] = 1;
  }
  particles.geometry = new BufferGeometry();
  particles.geometry.computeBoundingSphere();
  particles.geometry.setAttribute('position', particles.positions[particles.index]);
  particles.geometry.setAttribute('aPositionTarget', particles.positions[1]);
  particles.geometry.setAttribute('aSize', new BufferAttribute(sizeArray, 1));
  // particles.geometry.setIndex(null);
  particles.material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uResolution: new Uniform(new Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
      uProgress: new Uniform(0),
      uSize: new Uniform(0.1),
      uColorA: new Uniform(new Color(particles.colorA)),
      uColorB: new Uniform(new Color(particles.colorB))
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
  particles.morgh4 = () => { particles.morgh(4) };
  // particles.morgh4 = () => { particles.morgh(4) };

  const gui = new GUI();

  gui.add(particles.material.uniforms.uProgress, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .listen();

  gui.addColor(particles, 'colorA').onChange(() => {
    particles.material.uniforms.uColorA.value.set(particles.colorA);
  })
  gui.addColor(particles, 'colorB').onChange(() => {
    particles.material.uniforms.uColorB.value.set(particles.colorB);
  })

  gui.add(particles, 'morgh0');
  gui.add(particles, 'morgh1');
  gui.add(particles, 'morgh2');
  gui.add(particles, 'morgh3');
  gui.add(particles, 'morgh4');
  // gui.add(particles, 'morgh4');

  // console.log(particles.geometry)
  // animation
  // const radiansPerSecond = MathUtils.degToRad(10);
  // models.tick = (delta: any, deltaTime: any) => {
  //   // console.log(deltaTime)
  // }

  const gorups = new Group();
  gorups.add(particles.points);
  gorups.position.y = -2;
  return { gorups };
}

export { createModels }
