import {
  SphereGeometry,
  PointsMaterial,
  BoxGeometry,
  ShaderMaterial,
  Uniform,
  Vector2,
  Group,
  Points,
  AdditiveBlending
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import vertexShader from "./models_vt.glsl";
import fragmentShader from "./models_gm.glsl";

async function createModels(container: any) {

  const sizes = {
    width: container.clientWidth,
    height: container.clientHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }
  const particles: any = {};

  particles.geometry = new SphereGeometry(10);
  particles.geometry.setIndex(null);

  // particles.material = new PointsMaterial({
  //   size: 0.1,
  //   color: 0x00ff00,
  // });

  particles.material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uSize: new Uniform(0.2),
      uResolution: new Uniform(new Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),

    },
    blending: AdditiveBlending,
    depthWrite: false
  });


  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('src/assets/draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  const [rabbit, dragon] = await Promise.all([
    loader.loadAsync('src/assets/models/model.gltf'),
    loader.loadAsync('src/assets/models/model1.gltf'),
    // loader.loadAsync('src/assets/models/model2.gltf'),
  ]);

  const modelA = rabbit.scene.children[0].children[0].geometry;
  const modelB = dragon.scene.children[0].geometry


  particles.position = []
  particles.maxCount = 0;
  const modelPosition = modelA.attributes.position;
  if (modelPosition.count > particles.maxCount) {
    particles.maxCount = modelPosition.count;
    console.log('模型A有', particles.maxCount, '个顶点');
  }

  const modelArray = modelPosition.array;
  const newArray = new Float32Array(particles.maxCount * 3)
  console.log(newArray)
  for (let i = 0; i < particles.maxCount; i++) {
    const i3 = i * 3;
    if (i3 < modelArray.length) {

    }
  }

  particles.points = new Points(particles.geometry, particles.material);
  // console.log(modelA.attributes.position)


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
