import { GridHelper, PCFSoftShadowMap, Fog, FogExp2, MathUtils, Vector3 } from 'three';
import { createCamera } from '@/components/WorldCamera';
import { createScene, loadEvenMap } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
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

class Worlds {
  constructor(container: any) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(10, 8, 0)
    scene = createScene();
    renderer = createGLRenderer(window.devicePixelRatio);

    labelRenderer = createLabelRenderer(container.clientWidth, container.clientHeight);
    container.append(renderer.domElement);
    container.append(labelRenderer.domElement);
    controls = createControls(camera, renderer.domElement, labelRenderer.domElement);
    controls.maxPolarAngle = Math.PI / 2.4;
    loop = new Loop(camera, scene, renderer, labelRenderer);

    const resize = new Resizer(camera, renderer, window.devicePixelRatio);
    resize.onResize(container.offsetWidth, container.offsetHeight); // 初始化
    window.addEventListener("resize", () => {
      resize.onResize(container.offsetWidth, container.offsetHeight)
    });
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
    loop.updatable.push(controls, terrain, camera);
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
