import { WebGLRenderer, PerspectiveCamera } from "three";

function onResize(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer): void {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  if (renderer.setPixelRatio) {
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}
class Resizer {
  public container: HTMLElement;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  handleResize: () => void;
  constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
    this.handleResize = onResize.bind(null, this.container, this.camera, this.renderer);
    this.init();
  }
  init() {
    this.handleResize(); // 初始化 canvas 画布大小
    window.addEventListener("resize", this.handleResize);
  }
  update() {
    this.handleResize();
  }
  destroy() {
    window.removeEventListener("resize", this.handleResize);
    console.log("destroy resize");
  }
}
export { Resizer, onResize };
