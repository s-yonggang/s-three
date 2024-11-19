import { Color } from "three";
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createRenderer } from '@/components/SystemRenderder';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createControls } from '@/components/SystemControls';
import { createLights } from "./lights";
import { createModels } from "./models";

let camera: any;
let scene: any;
let renderer: any;
let controls: any;
let loop: any;

const position: any = [20, 20, 0];

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
    scene.backgroundColor = new Color(0x000000);
    renderer = createRenderer();
    renderer.domElement.style.backgroundColor = '#333'
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);
    new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }

  async init(container: any) {
    const { gorups } = await createModels(container);
    const { directionalLight, ambientLight } = createLights()
    scene.add(gorups, directionalLight, ambientLight);
    loop.updatables.push(controls);
  }
  render() {
    renderer.render(scene, camera);
  }
  start() {
    loop.css3Dstart();
  }
  stoop() {
    loop.stop();
  }
}

export { Worlds };
