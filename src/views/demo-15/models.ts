import {
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Color,
  CanvasTexture
} from "three";
// import GUI from "lil-gui";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
async function createModels(rtcVideo: any) {

  const canvas: any = document.createElement("canvas");
  const canvasDraw = () => {
    canvas.width = rtcVideo.videoWidth;
    canvas.height = rtcVideo.videoHeight;
    canvas.getContext('2d').drawImage(rtcVideo, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  const texture: any = new CanvasTexture(canvasDraw());

  const geometry = new PlaneGeometry(2, 2);
  const material = new MeshBasicMaterial({ color: new Color(0xffffff), map: texture })
  const plane = new Mesh(geometry, material);
  plane.rotation.y = -Math.PI / 2;
  plane.position.x = 2.5;
  plane.position.y = 1;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setPath('./models/');

  const [modelA] = await Promise.all([
    loader.loadAsync('minimalistic_modern_bedroom.glb'),
  ]);
  const model: any = modelA.scene;
  model.position.set(0, 1, 0);
  model.traverse((o: any) => {
    if (o.material) {
      o.material.depthWrite = true;
    }
  });

  const group = new Group()
  group.add(model, plane);
  // animation
  model.tick = (delta: number, deltaTime: any) => {
    canvasDraw();
    texture.needsUpdate = true;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
