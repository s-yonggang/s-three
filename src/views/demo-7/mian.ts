import { Color, Vector3, Scene, Camera, WebGLRenderer,PerspectiveCamera } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createModels } from "./models";

let scene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | never | null;
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
    camera.position.set(-18, 22, 24)
    scene = createScene();
    // scene.backgroundColor = new Color(0x000000);
    renderer = createGLRenderer(window.devicePixelRatio);
    // renderer.domElement.style.backgroundColor = '#333'
    container.append(renderer.domElement);
    loop = new Loop(camera, scene, renderer);

    controls = createControls(camera, renderer.domElement);
    resize = new Resizer(container, camera, renderer);
  }

  async init(container: HTMLDivElement, done: () => void) {
    const { gorups, onDestroy } = await createModels(container);
    done(); // 加载完成
    const { directionalLight, ambientLight } = createLights()
    scene?.add(gorups, directionalLight, ambientLight);
    loop?.updatable.push(controls as never);
    this.start();
    destroyed = onDestroy;
  }
  render() {
    // renderer?.render(scene as Scene, camera as Camera);
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
