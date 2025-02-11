import { WebGLRenderer, Camera } from "three";
class Resizer {
  private camera: Camera;
  private renderer: WebGLRenderer;
  private devicePixelRatio: number;
  constructor(camera: any, renderer: any, devicePixelRatio: number = 1) {
    this.camera = camera;
    this.renderer = renderer;
    this.devicePixelRatio = devicePixelRatio;
  }
  onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    if (this.renderer.setPixelRatio) {
      this.renderer.setPixelRatio(devicePixelRatio);
    }
  }
}
export { Resizer };
