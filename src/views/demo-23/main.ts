
import {
  Scene,
  Camera,
  WebGLRenderer,
  PerspectiveCamera,
  Vector2,
  ReinhardToneMapping,
  TorusGeometry,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Mesh,
  Color
} from 'three'

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { createControls } from '@/components/SystemControls';
import { Resizer } from '@/components/SystemResizer';
import { createStats } from '@/components/SystemStats';
import { Loop } from '@/components/SystemLoop';
import { createLights } from "./lights";
import { createModels } from "./models";

let scene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null | never;
let loop: Loop | null;
let destroyed: () => void;
let resize: Resizer | null;
let stats: any;
let composer: any;
let bloomPass: any;
let renderScene: any;
let outputPass: any;
const gui = new GUI();

class Worlds {
  container: HTMLDivElement;
  constructor(container: HTMLDivElement) {
    this.container = container;
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(0.5, -3.0, 3.0)
    scene = createScene();
    scene.background = new Color(0xa0a0a0);
    stats = new createStats(container); // 性能监视
    renderer = createGLRenderer(window.devicePixelRatio);
    renderer.toneMapping = ReinhardToneMapping;
    container.append(renderer.domElement);
    container.append(stats.dom);
    controls = createControls(camera, renderer.domElement) as OrbitControls;

    resize = new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer, composer);
  }
  async init(done: () => void) {
    const { group, onDestroy } = await createModels(scene, camera, renderer);
    done();
    destroyed = onDestroy;
    const { directionalLight, ambientLight, pointLight } = createLights()

    scene?.add(group);
    scene?.add(pointLight, directionalLight, ambientLight);

    // 光辉效果
    const params = {
      threshold: 1,
      strength: 0.2,
      radius: 0.8,
      exposure: 1,
    };
    bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;
    renderScene = new RenderPass(scene, camera);
    outputPass = new OutputPass();
    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);


    const bloomFolder = gui.addFolder("bloom");
    bloomFolder.add(params, "threshold", 0.0, 1.0).onChange(function (value: any) {
      bloomPass.threshold = Number(value);
    });
    bloomFolder.add(params, "strength", 0.0, 1.0).onChange(function (value: any) {
      bloomPass.strength = Number(value);
    });
    gui
      .add(params, "radius", 0.0, 1.0)
      .step(0.01)
      .onChange(function (value: any) {
        bloomPass.radius = Number(value);
      });
    const toneMappingFolder = gui.addFolder("tone mapping");
    toneMappingFolder.add(params, "exposure", 0.1, 2).onChange(function (value: any) {
      renderer.toneMappingExposure = Math.pow(value, 4.0);
    });
    composer.tick = () => {
      composer?.render();
    }

    loop?.updatable.push(controls, composer, stats);
    loop?.rStart();
  }
  render() {
    renderer?.render(scene as Scene, camera as Camera);
  }
  start() {
    loop?.rStart();
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
    resize = null
    stats?.destroy();
    // composer?.dispose();
    bloomPass = null;
    renderScene = null;
    outputPass = null;
    gui.destroy();
  }
}

export { Worlds };
