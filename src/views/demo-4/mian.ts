import { GridHelper, PCFSoftShadowMap, Fog, FogExp2 } from 'three';
import { createCamera } from '@/components/WorldCamera';
import { createScene, loadEvenMap } from '@/components/WorldScene';
import { createRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createTerrain } from "./terrain";

import posx from '@/assets/images/dark-s_px.jpg';
import negx from '@/assets/images/dark-s_nx.jpg';
import posy from '@/assets/images/dark-s_py.jpg';
import negy from '@/assets/images/dark-s_ny.jpg';
import posz from '@/assets/images/dark-s_pz.jpg';
import negz from '@/assets/images/dark-s_nz.jpg';
const urls = [posx, negx, posy, negy, posz, negz];

let camera: any;
let scene: any;
let renderer: any;
let controls: any;
let loop: any;

const position: any = [0, 10, 20];

class Worlds {
  constructor(container: any) {
    camera = createCamera(
      {
        fov: 60,
        aspect: container.innerWidth / container.innerHeight,
        near: 0.01,
        far: 2000,
      },
      position,
    );
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2.4;
    new Resizer(container, camera, renderer);
  }

  async init() {
    const fog = new FogExp2('0xcccccc', 0.02);
    await loadEvenMap(scene, urls);
    // controls.update();
    const { directionalLight, ambientLight } = createLights()
    const { terrain, shapeMesh } = await createTerrain();
    scene.add(fog, terrain, shapeMesh, directionalLight, ambientLight);
    loop.updatables.push(controls, terrain);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
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
