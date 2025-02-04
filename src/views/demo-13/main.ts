
import { Scene, Camera, WebGLRenderer, Vector3, Color, PCFSoftShadowMap,Fog, } from 'three'
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


const position: Vector3 = new Vector3(0.3, 0.4, 0.7);

class Worlds {
  container: HTMLDivElement;
  constructor(container: HTMLDivElement) {
    this.container = container;
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
    // scene.background = new Color(0xa0a0a0);
    // scene.fog = new Fog(0xa0a0a0, 0.2, 10);
    renderer = createGLRenderer();
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement) as OrbitControls;
    controls.maxPolarAngle = Math.PI / 2.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    controls.minDistance = 0.3;
    controls.maxDistance = 0.8;
    new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }
  async init(done: () => void) {
    const { group, onDestroy } = await createModels(this.container);
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
