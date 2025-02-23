import {
  Group,
  Mesh,
  TextureLoader,
  NearestFilter,
  MeshBasicMaterial,
  SphereGeometry,
  PerspectiveCamera
} from "three";
// import GUI from "lil-gui";
import { fragmentShaderReplacements } from "./frag";
import { loadCountryData, updateLabels } from "./load-data";
// import { GPUPickHelper } from "./pick-helper"
import { pickCountry, recordStartTimeAndPosition, paletteTexture, paletteTextureWidth } from "./pick-country"

async function createModels(container: HTMLDivElement, label: HTMLDivElement, camera: PerspectiveCamera, renderer: any, pickingScene: any) {

  /**
   * 创建geometry、加载texture
   */
  const earthGeometry = new SphereGeometry(1, 64, 32);
  const textureLoader = new TextureLoader()
  const [texture1, texture2] = await Promise.all([
    textureLoader.loadAsync('./texture/world_country_map.png'),
    textureLoader.loadAsync('./texture/world_map.png'),
  ])
  /**
   * 选中的
   */
  texture1.minFilter = NearestFilter;
  texture1.magFilter = NearestFilter;
  const earthMaterial1 = new MeshBasicMaterial({ map: texture1 });
  const earth1 = new Mesh(earthGeometry, earthMaterial1);
  /**
   * 默认的
   */
  const earthMaterial2 = new MeshBasicMaterial({ map: texture2 });
  earthMaterial2.onBeforeCompile = function (shader: any) {
    fragmentShaderReplacements.forEach((rep) => {
      shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
    });
    shader.uniforms.paletteTexture = { value: paletteTexture };
    shader.uniforms.indexTexture = { value: texture1 };
    shader.uniforms.paletteTextureWidth = { value: paletteTextureWidth };
  };
  const earth2 = new Mesh(earthGeometry, earthMaterial2)

  const settings = {
    minArea: 10,
    maxVisibleDot: - 0.2,
  };

  /**
   * 更新国家
   */
  const { countryInfos } = await loadCountryData(label);
  const updataData = updateLabels.bind(null, countryInfos, settings, camera, container);

  container.addEventListener('pointerdown', (e) => {
    recordStartTimeAndPosition(e, container)
  });
  container.addEventListener('pointerup', (e) => {
    pickCountry(e, container, pickingScene, camera, renderer, countryInfos)
  });
  pickCountry(null, container, pickingScene, camera, renderer, countryInfos)

  const group = new Group()
  group.add(earth1, earth2);
  // // animation
  earth2.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
    updataData()
  }

  const onDestroy = () => {
    // gui.destroy();
    earthGeometry.dispose();
    earthMaterial1.dispose();
    earthMaterial2.dispose();
    texture1.dispose();
    texture2.dispose();
    // container.removeEventListener('pointerdown', null);
    // container.removeEventListener('pointerup', null);
    group.remove(earth1);
    group.remove(earth2);
    group.clear();
   }

  return { earth1, earth2, group, onDestroy };
}
export { createModels }
