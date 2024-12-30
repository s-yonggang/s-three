import {
  Plane,
  Group,
  AnimationMixer,
  MeshLambertMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshDepthMaterial,
  DoubleSide,
  Mesh
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

async function createModels() {
  const modelParams: any = {
    actionSpeed: 1,
    actionIndex: null,
    metalness: 0.0,
    roughness: 0.2,
    transmission: 0.0,
    ior: 2.0,
    thickness: 1.0,
    color: 0xffffff,
    transparent: true,
    wireframe: false,
    isMap: false
  };

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
  const modelMapA: any = {
    bool: true,
  };
  const setModel = () => {
    model.traverse(function (mesh: Mesh) {
      if (mesh.isMesh) {
        if (modelMapA.bool) modelMapA[mesh.name] = mesh.material;
        mesh.castShadow = true;
        mesh.material = modelParams.isMap ? modelMapA[mesh.name] : new MeshPhysicalMaterial({
          side: DoubleSide,
          metalness: modelParams.metalness,
          roughness: modelParams.roughness,
          transmission: modelParams.transmission,
          ior: modelParams.ior,
          thickness: modelParams.thickness,
          color: modelParams.color,
          transparent: modelParams.transparent,
          wireframe: modelParams.wireframe,
        });;
      }
    });
    modelMapA.bool = false
  }
  setModel()

  model.position.set(0, -1, 0);
  model.castShadow = true;
  model.receiveShadow = true;

  const gui = new GUI({ width: 160 });
  gui.add(modelParams, 'actionSpeed')
    .min(0)
    .max(1)
    .step(0.001)
  // .onChange(setModel)
  gui.add(modelParams, 'metalness')
    .min(0)
    .max(1)
    .step(0.001)
    .onChange(setModel);
  gui.add(modelParams, 'roughness')
    .min(0)
    .max(1)
    .step(0.001)
    .onChange(setModel);
  gui.add(modelParams, 'transmission')
    .min(0)
    .max(1)
    .step(0.001)
    .onChange(setModel);
  gui.add(modelParams, 'ior')
    .min(1)
    .max(8)
    .step(0.001)
    .onChange(setModel);
  gui.add(modelParams, 'thickness')
    .min(0)
    .max(1)
    .step(0.001)
    .onChange(setModel);
  gui.add(modelParams, 'isMap').onChange(setModel);;

  const actionIndex = gui.addFolder(`actionIndex`,);
  // actionIndex.close();
  // animation
  const modelAnimation = [
    modelA.animations[33],
    modelA.animations[34],
    modelA.animations[35],
    modelA.animations[37],
    modelA.animations[41],
    modelA.animations[9],
    modelA.animations[15],
    modelA.animations[18],
    modelA.animations[20],
    modelA.animations[22],
    modelA.animations[29],
    modelA.animations[30],
    modelA.animations[32],
  ]
  let clip = modelAnimation[12];
  const mixer = new AnimationMixer(model);
  let action: any = mixer.clipAction(clip);
  for (let i = 0; i < modelAnimation.length; i++) {
    modelParams[`action-${i}`] = () => {
      action.stop();
      clip = modelAnimation[i];
      action = mixer.clipAction(clip);
      action.play();
    }
    actionIndex.add(modelParams, `action-${i}`)
  }
  action.play();
  model.tick = (delta: any) => {
    mixer.update(delta * modelParams.actionSpeed);
  }

  const onDestroy = () => {
    gui.destroy();
  }

  return { model, circle, onDestroy };
}

export { createModels }
