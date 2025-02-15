import {
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TextureLoader,
  SRGBColorSpace,
  Object3D,
  Color,
  BoxGeometry,
  MathUtils,
  BufferAttribute,
} from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import GUI from "lil-gui";
import { addBoxs } from "./addBoxs"
import { parseData } from "./parseDate";

async function loadFile(url: any) {
  const req = await fetch(url);
  // console.log(req);
  return req.text();
}


async function createModels() {
  const textureLoader = new TextureLoader()
  const [texture] = await Promise.all([
    textureLoader.loadAsync('./texture/word_map.jpg'),
  ])
  // texture.wrapS = RepeatWrapping;
  // texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  // geometry material
  const material = new MeshBasicMaterial({ map: texture })
  const geometry = new SphereGeometry(1, 64, 32);
  const earth: any = new Mesh(geometry, material);

  const data = await loadFile('./gis-data/earth.asc')
  const proData = await parseData(data)
  // console.log(proData);
  const { lonHelper, mesh } = addBoxs(proData)
  console.log(lonHelper,mesh);
  // .then(parseData)
  // .then(addBoxs)


  const group = new Group()
  group.add(earth,lonHelper,mesh);
  // animation
  earth.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
