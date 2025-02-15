import {
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TextureLoader,
  SRGBColorSpace,
} from "three";
import GUI from "lil-gui";
import { makeBoxes } from "./makeBoxes"
import { TweenManger } from "./tween"
import { loadAll } from "./load-all"

async function createModels() {

  /**
   * 球体、earthMaterial
   */
  const textureLoader = new TextureLoader()
  const [texture] = await Promise.all([
    textureLoader.loadAsync('./texture/word_map.jpg'),
  ])
  texture.colorSpace = SRGBColorSpace;
  const earthMaterial = new MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.9 });
  const earthGeometry = new SphereGeometry(1, 64, 32);
  const earth: any = new Mesh(earthGeometry, earthMaterial);

  /**
   * 获取并且处理数据
   */
  const fileInfosData = await loadAll();
  // const lonHelpers: any = []
  const geometries: any = fileInfosData.map((info: any) => {
    // const { mergedGeometry, lonHelper } = makeBoxes(info.file, info.hueRange, fileInfosData);
    // lonHelpers.push(lonHelper);
    const { mergedGeometry } = makeBoxes(info.file, info.hueRange, fileInfosData);
    return mergedGeometry;
  });

  /**
   * 使用第一组数据作为基础
   */
  const baseGeometry = geometries[0];
  baseGeometry.morphAttributes.position = geometries.map((geometry: any, ndx: any) => {
    const attribute = geometry.getAttribute('position');
    const name = `target${ndx}`;
    attribute.name = name;
    return attribute;
  });
  baseGeometry.morphAttributes.color = geometries.map((geometry: any, ndx: any) => {
    const attribute = geometry.getAttribute('color');
    const name = `target${ndx}`;
    attribute.name = name;
    return attribute;
  });
  const material = new MeshBasicMaterial({
    vertexColors: true,
  });
  const mesh = new Mesh(baseGeometry, material);


  /**
   * gui
   */
  const persons = {
    man: () => { handleData(fileInfosData, fileInfosData[0]) },
    woman: () => { handleData(fileInfosData, fileInfosData[1]) },
    manMore: () => { handleData(fileInfosData, fileInfosData[2]) },
    womanMore: () => { handleData(fileInfosData, fileInfosData[3]) },
  }
  const gui = new GUI();
  gui.add(persons, 'man');
  gui.add(persons, 'woman');
  gui.add(persons, 'manMore');
  gui.add(persons, 'womanMore');


  /**
   * 更新数据
   */
  const tweenManager = new TweenManger();
  function handleData(fileInfos: any, fileInfo: any) {
    const targets: any = {};
    fileInfos.forEach((item: any, inedx: any) => {
      targets[inedx] = fileInfo === item ? 1 : 0;
    });
    const durationInMs = 500;
    tweenManager.createTween(mesh.morphTargetInfluences)
      .to(targets, durationInMs)
      .start();
  }
  // let i = 0
  // setInterval(() => {
  //   handleData(fileInfosData, fileInfosData[i])
  //   i++;
  //   if (i >= 4) {
  //     i = 0
  //   }
  // }, 10000)

  const group = new Group()
  group.add(earth, mesh);
  // animation
  earth.tick = (delta: number, deltaTime: number) => {
    mesh.rotation.y += 0.002
    earth.rotation.y += 0.002
    tweenManager.update()
  }

  const onDestroy = () => {
    gui.destroy();
    geometries.forEach((geometry: any) => {
      geometry.dispose();
    });
    earthMaterial.dispose();
    earthGeometry.dispose();
    lonHelpers.forEach((lonHelper: any) => {
      lonHelper.dispose();
    });
    mesh.geometry.dispose();
    group.remove(mesh);
    group.remove(earth);
    tweenManager.destroy();
  }
  return { group, onDestroy };
}

export { createModels }
