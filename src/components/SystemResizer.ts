import { WebGLRenderer, PerspectiveCamera } from "three";

function onResize(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer, gizmo: any = null): void {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  console.log(camera.position)
  renderer.setSize(container.clientWidth, container.clientHeight);
  if (renderer.setPixelRatio) {
    renderer.setPixelRatio(window.devicePixelRatio);
  }
  if (gizmo) {
    gizmo.update();
  }
}
class Resizer {
  public container: HTMLElement;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public gizmo: any
  handleResize: () => void;
  constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer, gizmo: any = null) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
    this.gizmo = gizmo;
    this.handleResize = onResize.bind(null, this.container, this.camera, this.renderer, this.gizmo);
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
