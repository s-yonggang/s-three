import { Color, Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createModels } from "./models";

let scene: Scene | null;
let camera: PerspectiveCamera | null;
let renderer: WebGLRenderer | null;
let controls:  any | never;
let loop: Loop | null;
let destroyed: () => void;
let resize: Resizer | null;
class Worlds {
  constructor(container: any) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(30, 15, 0)
    scene = createScene();
    scene.background = new Color(0x000000);
    renderer = createGLRenderer();
    renderer.domElement.style.backgroundColor = '#000000'
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);
    resize = new Resizer(container, camera, renderer);
  }

  async init(done: () => void) {
    const { directionalLight, ambientLight } = createLights()
    const { group ,onDestroy} = await createModels();
    destroyed = onDestroy;
    done();
    scene?.add(group, directionalLight, ambientLight);
    loop = new Loop(camera as never, scene as never, renderer as never);
    loop.updatable.push(controls as never, group.children[0] as never);
    loop.start();
  }
  render() {
    renderer?.render(scene as never, camera as never);
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
