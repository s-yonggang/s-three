import { Scene, CubeTextureLoader, ArrowHelper, AxesHelper } from "three"

async function loadEvenMap( urls: string[] = []) {
  if (urls.length > 0) {
    const textureCube = await new CubeTextureLoader().load(urls);
    console.log('++++');
    return textureCube
  }
}
const axes = new AxesHelper();
function createScene(): Scene {
  const scene = new Scene()
  // scene.add(axes)
  return scene;

}
export { createScene, loadEvenMap }
