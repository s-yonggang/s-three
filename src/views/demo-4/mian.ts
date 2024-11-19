import { GridHelper, PCFSoftShadowMap, Fog, FogExp2, MathUtils } from 'three';
import { createCamera } from '@/components/WorldCamera';
import { createScene, loadEvenMap } from '@/components/WorldScene';
import { createRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLabelRenderer } from '@/components/WorldLabelRenderer'
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
let labelRenderer: any;

const position: any = [10, 8, 0];

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
    renderer = createRenderer();

    labelRenderer = createLabelRenderer(container.clientWidth, container.clientHeight);
    container.append(renderer.domElement);
    container.append(labelRenderer.domElement);
    controls = createControls(camera, renderer.domElement, labelRenderer.domElement);
    controls.maxPolarAngle = Math.PI / 2.4;
    new Resizer(container, camera, renderer, labelRenderer);
    loop = new Loop(camera, scene, renderer, labelRenderer);
  }

  async init() {
    await loadEvenMap(scene, urls);
    // controls.update();
    const { directionalLight, ambientLight } = createLights()
    const { terrain, shapeMesh, groupLabel } = await createTerrain();
    scene.add(terrain, shapeMesh, groupLabel, directionalLight, ambientLight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

    // const radiansPerSecond = MathUtils.degToRad(10);
    camera.tick = (delta: any, deltaTime: any) => {
      // camera.rotateZ(delta)
    }
    loop.updatables.push(controls, terrain, camera);
  }
  render() {
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  start() {
    loop.start();
  }
  stoop() {
    loop.stop();
  }
}

export { Worlds };
