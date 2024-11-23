import {
  Plane,
  Group,
  AnimationMixer,
  MeshLambertMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshDepthMaterial,
  Mesh
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

async function createModels() {


  const geometry = new CircleGeometry(40, 32);
  const material = new MeshPhysicalMaterial({ color: 0xaf1f1f1, });
  const circle = new Mesh(geometry, material);
  circle.position.y = -1.001;
  circle.rotation.x = Math.PI / -2
  circle.castShadow = true;
  circle.receiveShadow = true;


  // gltf-格式-模型压缩
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  // loader.setDRACOLoader(dracoLoader);
  const [modelA] = await Promise.all([
    loader.loadAsync('./models/jfjh.glb'),
  ]);

  const model: any = modelA.scene.children[0];
  model.traverse(function (object) {
    if (object.isMesh) {
      object.castShadow = true;
      object.material = new MeshPhysicalMaterial();
    }
  });

  model.position.set(0, -1, 0);
  model.castShadow = true;
  model.receiveShadow = true;
  const actionParams: any = {
    speed: 1,
  };

  const gui = new GUI({ width: 200 });
  gui.add(actionParams, 'speed')
    .min(0)
    .max(1)
    .step(0.001)
    .listen();

  // animation
  const modelAnimation = [
    modelA.animations[33],
    modelA.animations[34],
    modelA.animations[35],
    modelA.animations[37],
    modelA.animations[9],
    modelA.animations[15],
    modelA.animations[17],
    modelA.animations[18],
    modelA.animations[20],
    modelA.animations[21],
    modelA.animations[22],
    modelA.animations[23],
    modelA.animations[29],
    modelA.animations[30],
    modelA.animations[32],
    modelA.animations[41],
  ]

  let clip = modelAnimation[14];
  const mixer = new AnimationMixer(model);
  let action: any = mixer.clipAction(clip);
  for (let i = 0; i < modelAnimation.length; i++) {
    actionParams[`action${i}`] = () => {
      action.stop();
      clip = modelAnimation[i];
      action = mixer.clipAction(clip);
      action.play();
    }
    gui.add(actionParams, `action${i}`);
  }
  action.play();
  model.tick = (delta: any) => {
    mixer.update(delta * actionParams.speed);
  }

  return { model, circle };
}

export { createModels }
