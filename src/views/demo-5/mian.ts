import { Color, Vector3 } from "three";
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer, createCSS3DRenderer } from '@/components/SystemRenderder';
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
let resize: Resizer

class Worlds {
  constructor(container: any) {
    const cameraParams = {
      fov: 60,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.01,
      far: 2000,
    }
    camera = createCamera(cameraParams);
    camera.position.set(2300, 1900, 0)
    scene = createScene();
    scene.backgroundColor = new Color(0x000000);
    renderer = createCSS3DRenderer();
    renderer.domElement.style.backgroundColor = '#000000'
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);
    resize = new Resizer(container, camera, renderer);
    loop = new Loop(camera, scene, renderer);
  }

  async init() {
    const { particlesGroup } = await createModels();
    const { directionalLight, ambientLight } = createLights()
    scene.add(particlesGroup, directionalLight, ambientLight);
    loop.updatable.push(controls, particlesGroup);
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
