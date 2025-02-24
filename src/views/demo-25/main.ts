
import { Scene, Camera, WebGLRenderer, PerspectiveCamera, NeutralToneMapping,PCFSoftShadowMap } from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer, createGPURenderer } from '@/components/SystemRenderder';
import { createControls } from '@/components/SystemControls';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createLights } from "./lights";
import { createModels } from "./models";
import { composedBackground } from "./light-speed";

let scene: Scene | null;
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
    camera.position.set(-4, 3.2, 5);
    scene = createScene();
    scene.backgroundNode = composedBackground;

    // scene.add(axes);
    // scene.add(grid);
    renderer = createGPURenderer(window.devicePixelRatio);
    renderer.toneMapping = NeutralToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);

    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 3;
    controls.maxDistance = 8;

    resize = new Resizer(container, camera, renderer);
  }
  async init(done: () => void) {
    const { group, onDestroy } = await createModels();
    done();
    const { directionalLight, ambientLight } = createLights()
    scene?.add(group, directionalLight, ambientLight);


    loop = new Loop(camera as never, scene as never, renderer as never);
    loop.updatable.push(controls as never, group.children[0] as never);
    loop.start();
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
    resize?.destroy();
    resize = null;
  }
}

export { Worlds };
