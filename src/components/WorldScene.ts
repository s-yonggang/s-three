import { Scene, CubeTextureLoader } from "three"

async function loadEvenMap(scene: any, urls: string[] = []) {
  if (urls.length > 0) {
    const textureCube = await new CubeTextureLoader().load(urls);
    scene.background = textureCube;
  }
}

function createScene(): Scene {
  const scene = new Scene()
  return scene;

}
export { createScene, loadEvenMap }
