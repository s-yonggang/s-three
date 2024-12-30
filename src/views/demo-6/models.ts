import {
  Plane,
  Group,
  AnimationMixer,
  MeshLambertMaterial,
  CircleGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshDepthMaterial,
  DoubleSide,
  Mesh
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { onDirection } from './direction'
import GUI from 'lil-gui';
import gsap from 'gsap';

async function createModels() {
  const modelParams: any = {
    actionSpeed: 1,
  };

  const geometry = new PlaneGeometry(200, 200);
  const material = new MeshPhysicalMaterial({ color: 0xaf1f1f1, });
  const circle = new Mesh(geometry, material);
  circle.position.y = -1.001;
  circle.rotation.x = Math.PI / -2
  // circle.castShadow = true;
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
  model.traverse(function (mesh: Mesh) {
    if (mesh.isMesh) {
      mesh.material = new MeshPhysicalMaterial()
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  })

  model.position.set(0, -1, 0);
  model.rotation.y = 0


  // actionIndex.close();
  // animation
  const skeleton = (val: number = 0) => {
    const modelAnimation = [
      modelA.animations[33],
      modelA.animations[15],
      modelA.animations[29],
    ]
    const clip = modelAnimation[val];
    const mixer = new AnimationMixer(model);
    const action: any = mixer.clipAction(clip);
    action.stop();
    action.play();

    model.tick = (delta: any) => {
      mixer.update(delta * modelParams.actionSpeed);
    }
  }
  skeleton()

  const onDestroy = () => { }

  return { model, circle, skeleton, onDestroy };
}

export { createModels }
