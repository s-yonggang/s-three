import {
  PlaneGeometry,
  BoxGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

async function createModels() {
  const group = new Group()

  // gltf-格式-模型压缩
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  // loader.setDRACOLoader(dracoLoader);
  const [modelA, modelB, modelC, modelD, modelE] = await Promise.all([
    loader.loadAsync('./models/garmentmaking/step1.glb'),
    loader.loadAsync('./models/garmentmaking/step2.glb'),
    loader.loadAsync('./models/garmentmaking/step3.glb'),
    loader.loadAsync('./models/garmentmaking/step4.glb'),
    loader.loadAsync('./models/garmentmaking/step5.glb'),
  ]);

  const modelArr = [modelA, modelB, modelC, modelD, modelE]

  const models: any = {
    view: null,
    viewStep0: () => seModel(0),
    viewStep1: () => seModel(1),
    viewStep2: () => seModel(2),
    viewStep3: () => seModel(3),
    viewStep4: () => seModel(4),
  }

  function seModel(i:number){
    group.clear();
    models.view = modelArr[i].scene;
    group.add(models.view);
  }

  models.view = modelArr[0].scene;

  // gui
  const gui = new GUI();
  gui.add(models, 'viewStep0'); 	// button
  gui.add(models, 'viewStep1'); 	// button
  gui.add(models, 'viewStep2'); 	// button
  gui.add(models, 'viewStep3'); 	// button
  gui.add(models, 'viewStep4'); 	// button

  // 模型选中















  group.add(models.view);
  group.position.y = -1;
  // animation
  models.view.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
  }

  const onDestroy = () => { }
  return { group, onDestroy };
}

export { createModels }
