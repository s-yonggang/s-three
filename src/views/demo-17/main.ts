
import { Scene, Camera, WebGLRenderer, Vector3, Color, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { createControls } from '@/components/SystemControls';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createLights } from "./lights";
import { createModels } from "./models";

let scene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null | never;
let loop: Loop | null;
let destroyed: () => void;
let rezise: Resizer | null

class Worlds {
  constructor(container: HTMLDivElement) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(2, 2, 2)
    scene = createScene();
    scene.background = new Color(0x000000);
    // scene.add(axes);
    // scene.add(grid);
    renderer = createGLRenderer(window.devicePixelRatio);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement) as OrbitControls;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 3;
    rezise = new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }
  async init(done: () => void) {
    const { group, onDestroy } = await createModels();
    done();
    const { directionalLight, ambientLight } = createLights()
    scene?.add(group, directionalLight, ambientLight);
    loop?.updatable.push(controls as never, group.children[0] as never);
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
    rezise?.destroy();
    rezise = null;
  }
}

export { Worlds };
