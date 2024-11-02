import { GridHelper, PCFSoftShadowMap, FogExp2 } from 'three';
import { createCamera } from '@/components/WorldCamera';
import { createScene, loadEvenMap } from '@/components/WorldScene';
import { createRenderer } from '@/components/SystemRenderder';
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

let camera: any;
let scene: any;
let renderer: any;
let controls: any;
let loop: any;

const grid = new GridHelper(400, 20);
const position: any = [0, 16, -60];

class Worlds {
  constructor(container: any) {
    camera = createCamera(
      {
        fov: 60,
        aspect: container.innerWidth / container.innerHeight,
        near: 0.01,
        far: 4000,
      },
      position,
    );
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2.2;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

    new Resizer(container, camera, renderer);
    // scene.add(grid);
    // scene.fog = new FogExp2(0x333333, 0.01);
  }

  async init() {
    // controls.update();
    await loadEvenMap(scene, urls);
    const { sphere, plane } = await createCube();
    const {
      spotLight,
      pointLight,
      ambientLight,
      directionalLight,
      spotLightHelper,
      pointLightHelper,
      directionalLightHelper,
    } = createLights();
    loop.updatables.push(controls, sphere);
    scene.add(
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
