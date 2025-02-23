import {
  PlaneGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  MeshBasicMaterial,
  BoxGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";
import { NodeMaterial } from 'three/webgpu';
import { reflector, } from 'three/tsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

async function createModels() {
  const wheels: Array<any> = [];

  const bodyMaterial = new MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03
  });

  const detailsMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5
  });

  const glassMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0,
    transmission: 2.0
  });

  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  const [modelA] = await Promise.all([
    loader.loadAsync('./models/ferrari.glb'),
  ]);
  const carModel: any = modelA.scene.children[0];
  carModel.getObjectByName('body').material = bodyMaterial;
  carModel.getObjectByName('lights').material = bodyMaterial;
  carModel.getObjectByName('lights_red').material = bodyMaterial;

  carModel.getObjectByName('rim_fl').material = detailsMaterial;
  carModel.getObjectByName('rim_fr').material = detailsMaterial;
  carModel.getObjectByName('rim_rr').material = detailsMaterial;
  carModel.getObjectByName('rim_rl').material = detailsMaterial;
  carModel.getObjectByName('trim').material = detailsMaterial;
  carModel.getObjectByName('glass').material = glassMaterial;
  wheels.push(
    carModel.getObjectByName('wheel_fl'),
    carModel.getObjectByName('wheel_fr'),
    carModel.getObjectByName('wheel_rl'),
    carModel.getObjectByName('wheel_rr')
  );
  console.log(carModel.getObjectByName('glass').material.map);
  carModel.getObjectByName('glass').material.map = null;

  const gui: GUI = new GUI();
  gui.addColor(bodyMaterial, 'color').name('bodyMaterial');
  gui.addColor(glassMaterial, 'color').name('glassMaterial');
  gui.addColor(detailsMaterial, 'color').name('detailsMaterial');


  // floor
  const reflection = reflector();
  reflection.target.rotateX(- Math.PI / 2);
  const floorMaterial = new NodeMaterial();
  floorMaterial.colorNode = reflection;
  floorMaterial.opacity = .2;
  floorMaterial.transparent = true;
  const floor = new Mesh(new BoxGeometry(50, .001, 50), floorMaterial);
  floor.receiveShadow = true;
  floor.position.set(0, 0, 0);

  const group = new Group()
  group.add(carModel, reflection.target, floor);
  // animation,
  carModel.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    for (let i = 0; i < wheels.length; i++) {
      wheels[i].rotation.x = -deltaTime*8.0;
    }
    // carModel.getObjectByName('glass').material.envMapRotation +=0.5
    // carModel.getObjectByName('glass').material.needsUpdate = true;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
