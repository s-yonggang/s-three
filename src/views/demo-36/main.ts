
import { Scene, Camera, WebGLRenderer, Vector3, Color, GridHelper, AxesHelper, Fog, PerspectiveCamera } from 'three'
import { ViewportGizmo } from "three-viewport-gizmo"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer, createGPURenderer } from '@/components/SystemRenderder';
import { createControls } from '@/components/SystemControls';
import { Resizer } from '@/components/SystemResizer';
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
let gizmo: ViewportGizmo

class Worlds {
  constructor(container: HTMLDivElement) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(6, 4, 2);
    scene = createScene();
    scene.background = new Color(0x000000);
    // scene.fog = new Fog(0x333333, 30, 40);
    // scene.add(axes);
    // scene.add(grid);

    renderer = createGLRenderer(window.devicePixelRatio);
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement) as OrbitControls;
    controls.enableDamping = false;
    gizmo = new ViewportGizmo(
      camera,
      renderer,
      {
        placement: 'bottom-right',
        offset: { right: 40, bottom: 20 },
        // size: 50
      });
    // gizmo.offset
    gizmo.attachControls(controls);
    gizmo.tick = () => {
      gizmo.render();
    }

    resize = new Resizer(container, camera, renderer, gizmo);
  }
  async init(done: () => void) {
    const { group, onDestroy, tControl } = await createModels(camera, renderer, controls);
    done();
    const { directionalLight, ambientLight } = createLights()
    scene?.add(group, directionalLight, ambientLight);

    loop = new Loop(camera as never, scene as never, renderer as never);
    loop.updatable.push(gizmo as never, group.children[0] as never);
    loop.rStart();
    destroyed = onDestroy;

    return function (val: any) {
      tControl.setMode(val);
    }

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
    resize = null;
    gizmo.dispose();
  }
}

export { Worlds };
