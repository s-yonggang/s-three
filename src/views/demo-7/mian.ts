import { Color, Vector3,Scene,Camera,WebGLRenderer } from "three";
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
let camera: Camera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null;
let loop: Loop | null;
let destroyed: () => void;

const position: Vector3 = new Vector3(-18, 22, 24);

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
    renderer = createGLRenderer();
    // renderer.domElement.style.backgroundColor = '#333'
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);
    new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }

  async init(container: any, done: () => void) {
    const { gorups, onDestroy } = await createModels(container);
    done(); // 加载完成
    const { directionalLight, ambientLight } = createLights()
    scene?.add(gorups, directionalLight, ambientLight);
    loop?.updatable.push(controls);
    this.start();
    destroyed = onDestroy;
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
  }
}

export { Worlds };
