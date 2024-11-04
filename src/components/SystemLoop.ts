import { Clock } from 'three';

const clock = new Clock();

class Loop {
  constructor(camera: any, scene: any, renderer: any, labelRenderer: any = null) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.labelRenderer = labelRenderer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      this.renderer.render(this.scene, this.camera);
      if (this.labelRenderer) {
        this.labelRenderer.render(this.scene, this.camera);
      }
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = clock.getDelta();
    const deltaTime = clock.getElapsedTime();
    for (const item of this.updatables) {
      item.tick(delta, deltaTime);
    }
  }
}

export { Loop };
