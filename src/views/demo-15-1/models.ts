import {
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Color,
  SRGBColorSpace,
  VideoTexture
} from "three";
// import GUI from "lil-gui";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
async function createModels(rtcVideo: any) {
  const videoTexture = new VideoTexture(rtcVideo);
  videoTexture.colorSpace = SRGBColorSpace;
  const geometry = new PlaneGeometry(2, 2);
  const material = new MeshBasicMaterial({ color: new Color(0xffffff), map: videoTexture })
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
  // model.tick = (delta: number, deltaTime: any) => {
  //   // canvasDraw();
  //   // texture.needsUpdate = true;
  // }

  const onDestroy = () => {
    videoTexture.dispose();
    material.dispose();
    geometry.dispose();
    // loader.dispose();
    dracoLoader.dispose();
    model.traverse((o: any) => {
      if (o.material) {
        o.material.dispose();
      }
    });
    group.remove(model);
    group.remove(plane);
  }

  return { group, onDestroy };
}

export { createModels }
