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
  const mesh: any = new Mesh(geometry, material);

  let lonHelper: any;
  function makeBoxes(file: any, hueRange: any, fileInfos: any) {

    const { min, max, data } = file;
    const range = max - min;

    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    lonHelper = new Object3D();
    // scene.add( lonHelper );
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);
    // Used to move the center of the cube so it scales from the position Z axis
    const originHelper = new Object3D();
    originHelper.position.z = 0.5;
    positionHelper.add(originHelper);
    const color = new Color();
    const lonFudge = Math.PI * .5;
    const latFudge = Math.PI * - 0.135;
    const geometries: any = [];
    data.forEach((row: any, latNdx: any) => {
      row.forEach((value: any, lonNdx: any) => {
        if (dataMissingInAnySet(fileInfos, latNdx, lonNdx)) {
          return;
        }
        const amount = (value - min) / range;
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

        // adjust the helpers to point to the latitude and longitude
        lonHelper.rotation.y = MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
        latHelper.rotation.x = MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

        // use the world matrix of the origin helper to
        // position this geometry
        positionHelper.scale.set(0.005, 0.005, MathUtils.lerp(0.01, 0.5, amount));
        originHelper.updateWorldMatrix(true, false);
        geometry.applyMatrix4(originHelper.matrixWorld);

        // compute a color
        const hue = MathUtils.lerp(...hueRange, amount);
        const saturation = 1;
        const lightness = MathUtils.lerp(0.4, 1.0, amount);
        color.setHSL(hue, saturation, lightness);
        // get the colors as an array of values from 0 to 255
        const rgb = color.toArray().map(v => v * 255);

        // make an array to store colors for each vertex
        const numVerts = geometry.getAttribute('position').count;
        const itemSize = 3; // r, g, b
        const colors = new Uint8Array(itemSize * numVerts);

        // copy the color into the colors array for each vertex
        colors.forEach((v, ndx) => {

          colors[ndx] = rgb[ndx % 3];

        });
        const normalized = true;
        const colorAttrib = new BufferAttribute(colors, itemSize, normalized);
        geometry.setAttribute('color', colorAttrib);
        geometries.push(geometry);

      });

    });
    return BufferGeometryUtils.mergeGeometries(geometries, false);
  }














  const group = new Group()
  group.add(mesh);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
