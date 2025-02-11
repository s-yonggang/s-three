import { Clock, Camera, Scene, WebGLRenderer, } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const clock = new Clock();

interface LoopType {
  camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
  labelRenderer: CSS3DRenderer;
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
  labelRenderer: CSS3DRenderer;
  updatable: Array<never>;
  constructor(camera: Camera, scene: Scene, renderer: WebGLRenderer, labelRenderer: CSS3DRenderer | null = null) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.labelRenderer = labelRenderer as CSS3DRenderer;
    this.updatable = [];
  }

  start() {
    console.log(this.renderer.setAnimationLoop);
    this.renderer.setAnimationLoop(()=>{})
    // this.renderer.setAnimationLoop(() => {
    //   this.tick();
    //   this.renderer.render(this.scene, this.camera);
    //   if (this.labelRenderer) {
    //     this.labelRenderer.render(this.scene, this.camera);
    //   }
    // });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  css3Dstart() {
    const animation = (): void => {
      requestAnimationFrame(animation)
      this.tick();
      this.renderer.render(this.scene, this.camera);
    }
    animation();
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
