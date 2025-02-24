
import { Scene, Camera, WebGLRenderer, Vector3, Color, GridHelper, AxesHelper, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer, createGPURenderer } from '@/components/SystemRenderder';
import { createControls } from '@/components/SystemControls';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createLights } from "./lights";
import { createModels } from "./models";

let scene: Scene | null;
let pickingScene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null | never;
let loop: Loop | null;
let destroyed: () => void;
let resize: Resizer | null;

class Worlds {
  constructor(container: HTMLDivElement) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(-0.4, 1.5, -1.9);
    scene = createScene();
    scene.background = new Color(0x000000);

    pickingScene = new Scene();
    pickingScene.background = new Color(0);

    renderer = createGLRenderer(window.devicePixelRatio);
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 3;
    resize = new Resizer(container, camera, renderer);
  }
  async init(label: HTMLDivElement, done: () => void) {
    const { directionalLight, ambientLight } = createLights()
    const { earth1, earth2, onDestroy } = await createModels(renderer?.domElement as any, label, camera as PerspectiveCamera, renderer, pickingScene);
    scene?.add(earth2, directionalLight, ambientLight);
    pickingScene?.add(earth1);


    loop = new Loop(camera as never, scene as never, renderer as never);
    loop.updatable.push(controls as never, earth2 as never);
    loop.start();
    destroyed = onDestroy;
    done();
  }
  render() {
    renderer?.render(scene as Scene, camera as Camera);

  }
  start() {
    loop?.start();
  }
  stoop() {
    loop?.stop();
  }
  destroy() {
    renderer?.setAnimationLoop(null);
    destroyed();
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    loop = null;
    resize?.destroy();
    resize = null;
  }
}

export { Worlds };
