
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createModels } from "./models";
import { createLabelRenderer } from "@/components/WorldLabelRenderer"

let camera: any;
let scene: any;
let renderer: any;
let controls: any;
let loop: any;
let labelRenderer: any;

const position: any = [0, 10, 20];

class Worlds {
  constructor(container: any) {
    camera = createCamera(
      {
        fov: 60,
        aspect: container.clientWidth / container.clientWidth,
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
    new Resizer(container, camera, renderer, labelRenderer);
    loop = new Loop(camera, scene, renderer, labelRenderer);
  }

  async init() {
    const { mesh } = await createModels();
    const { directionalLight, ambientLight } = createLights()
    scene.add(mesh, directionalLight, ambientLight);
    // loop.updatables.push(controls);

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
