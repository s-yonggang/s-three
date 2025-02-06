
import { Scene, Camera, WebGLRenderer, Vector3, Color } from 'three'
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
let camera: Camera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null | never;
let loop: Loop | null;
let destroyed: () => void;

const position: Vector3 = new Vector3(-3, 3.5, 5);

class Worlds {
  constructor(container: HTMLDivElement) {
    camera = createCamera(
      {
        fov: 60,
        aspect: container.clientWidth / container.clientHeight,
        near: 0.01,
        far: 2000,
      },
      position,
    );
    scene = createScene();
    scene.background = new Color(0x000000);
    // scene.add(axes);
    // scene.add(grid);
    renderer = createGLRenderer();
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement) as OrbitControls;
    new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }
  async init(done: () => void, rtc: any) {
    const { group, onDestroy } = await createModels(rtc);
    done();
    const { directionalLight, ambientLight } = createLights()
    scene?.add(group, directionalLight, ambientLight);
    loop?.updatable.push(controls, group.children[0]);
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
    destroyed?.();
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    loop = null;

  }
}

export { Worlds };
