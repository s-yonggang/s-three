import { Color, PCFSoftShadowMap, Fog, Scene, WebGLRenderer ,PerspectiveCamera} from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createModels } from "./models";
// import { debounce } from "lodash";
// console.log(debounce);

let scene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null;
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
    camera.position.set(4, 1, 0)
    scene = createScene();
    // scene.backgroundColor = new Color(0x000000);
    scene.background = new Color(0xa0a0a0);
    scene.fog = new Fog(0xa0a0a0, 10, 18);
    renderer = createGLRenderer(window.devicePixelRatio);
    // renderer.domElement.style.backgroundColor = '#333'
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement) as OrbitControls;

    loop = new Loop(camera, scene, renderer);
    controls.maxPolarAngle = Math.PI / 2.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    controls.minDistance = 3;
    controls.maxDistance = 12;

    resize = new Resizer(container, camera, renderer);
  }

  async init(done: () => void) {
    const { model, circle, onDestroy } = await createModels();
    done(); // 加载完成
    const { directionalLight, ambientLight } = createLights()
    scene?.add(model, circle, directionalLight, ambientLight);
    loop?.updatable.push(controls as never, model as never);
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
