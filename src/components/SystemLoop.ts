import { Clock, Camera, Scene, WebGLRenderer, } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const clock = new Clock();

interface LoopType {
  camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
  // labelRenderer: CSS3DRenderer;
  updatable: Array<never>;
  tick: () => void;
}

type LoopKey = {
  [K in keyof LoopType]?: LoopType[K]
}

class Loop implements LoopType {
  camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
  updatable: Array<never>;
  constructor(camera: Camera, scene: Scene, renderer: WebGLRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatable = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      this.renderer.render(this.scene, this.camera);

      // this.renderer.render(this.scene, this.camera);
      // this.tick();
    });
  }

  // renderer.render优先
  rStart() {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
      this.tick();
    });
  }
  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = clock.getDelta();
    const deltaTime = clock.getElapsedTime();
    for (const item of this.updatable) {
      const temp: any = item;
      temp?.tick(delta, deltaTime);
    }
  }
}

export { Loop };
