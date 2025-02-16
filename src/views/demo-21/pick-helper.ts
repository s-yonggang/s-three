import { WebGLRenderTarget } from "three"

class GPUPickHelper {
  pickingTexture: WebGLRenderTarget
  pixelBuffer: Uint8Array
  constructor() {
    this.pickingTexture = new WebGLRenderTarget(1, 1);
    this.pixelBuffer = new Uint8Array(4);
  }
  pick(cssPosition: any, scene: any, camera: any, renderer: any) {
    const { pickingTexture, pixelBuffer } = this;
    const pixelRatio = renderer.getPixelRatio();
    camera.setViewOffset(
      renderer.getContext().drawingBufferWidth, // full width
      renderer.getContext().drawingBufferHeight, // full top
      cssPosition.x * pixelRatio | 0, // rect x
      cssPosition.y * pixelRatio | 0, // rect y
      1, // rect width
      1, // rect height
    );
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    camera.clearViewOffset();
    renderer.readRenderTargetPixels(
      pickingTexture,
      0, // x
      0, // y
      1, // width
      1, // height
      pixelBuffer);
    const id =
      (pixelBuffer[0] << 0) |
      (pixelBuffer[1] << 8) |
      (pixelBuffer[2] << 16);
    return id;
  }
}

export { GPUPickHelper }
