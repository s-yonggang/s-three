import {
  PCFSoftShadowMap,
  Vector3,
  Scene,
  Camera,
  WebGLRenderer,
  PerspectiveCamera
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene, loadEvenMap } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from './lights';
import { createCube } from './cube';
import posx from '@/assets/images/posx.jpg';
import negx from '@/assets/images/negx.jpg';
import posy from '@/assets/images/posy.jpg';
import negy from '@/assets/images/negy.jpg';
import posz from '@/assets/images/posz.jpg';
import negz from '@/assets/images/negz.jpg';
const urls = [posx, negx, posy, negy, posz, negz];

let scene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null;
let loop: Loop | null;
let destroyed: () => void;
let resize: Resizer;

class Worlds {
  constructor(container: any) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(0, 16, -60);
    scene = createScene();
    renderer = createGLRenderer(window.devicePixelRatio);
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement) as OrbitControls;
    controls.maxPolarAngle = Math.PI / 2.2;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

    // scene.add(grid);
    // scene.fog = new FogExp2(0x333333, 0.01);

    controls = createControls(camera, renderer.domElement);
    resize = new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }

  async init(done: () => void) {
    // controls.update();
    await loadEvenMap(scene, urls);
    const { sphere, plane, onDestroy } = await createCube();
    const {
      spotLight,
      ambientLight,
      // pointLight,
      // directionalLight,
      // spotLightHelper,
      // pointLightHelper,
      // directionalLightHelper,
    } = createLights();
    loop?.updatable.push(controls as never, sphere as never);
    scene?.add(
      plane,
      sphere,
      spotLight,
      // pointLight,
      ambientLight,
      // directionalLight,
      // spotLightHelper,
      // pointLightHelper,
      // directionalLightHelper,
    );
    done();
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
