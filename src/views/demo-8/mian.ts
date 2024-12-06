import { Color, PCFSoftShadowMap, Fog } from "three";
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createModels } from "./models";

let camera: any;
let scene: any;
let renderer: any;
let controls: any;
let loop: any;

const position: any = [4, 1, 0];

class Worlds {
  constructor(container: any) {
    camera = createCamera(
      {
        fov: 60,
        aspect: container.clientWidth / container.clientHight,
        near: 0.01,
        far: 2000,
      },
      position,
    );
    scene = createScene();
    // scene.backgroundColor = new Color(0x000000);
    scene.background = new Color(0xa0a0a0);
    scene.fog = new Fog(0xa0a0a0, 10, 18);
    renderer = createRenderer();
    // renderer.domElement.style.backgroundColor = '#333'
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);
    new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
    controls.maxPolarAngle = Math.PI / 2.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    controls.minDistance = 3;
    controls.maxDistance = 12;
  }

  async init(done: () => void) {
    const { model, circle } = await createModels();
    done(); // 加载完成
    const { directionalLight, ambientLight } = createLights()
    scene.add(model, circle, directionalLight, ambientLight);
    loop.updatables.push(controls, model);
    this.start();
  }
  render() {
    renderer.render(scene, camera);
  }
  start() {
    loop.start();
  }
  stoop() {
    loop.stop();
  }
}

export { Worlds };
