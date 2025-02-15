import {
  Object3D,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  MathUtils,
  BufferAttribute,
  Color
} from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function dataMissingInAnySet(fileInfos: any, latNdx: any, lonNdx: any): any {
  for (const fileInfo of fileInfos) {
    if (fileInfo.file.data[latNdx][lonNdx] === undefined) {
      return true;
    }
  }
  return false;
}

function makeBoxes(file: any, hueRange: any, fileInfos: any) {
  const { min, max, data } = file;
  const range: any = max - min;

  const lonHelper = new Object3D();
  // scene.add( lonHelper );

  const latHelper = new Object3D();
  lonHelper.add(latHelper);

  const positionHelper = new Object3D();
  positionHelper.position.z = 1;
  latHelper.add(positionHelper);

  const originHelper = new Object3D();
  originHelper.position.z = 0.5;
  positionHelper.add(originHelper);

  const color: any = new Color();
  const lonFudge: any = Math.PI * .5;
  const latFudge: any = Math.PI * - 0.135;
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

      lonHelper.rotation.y = MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
      latHelper.rotation.x = MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

      positionHelper.scale.set(0.005, 0.005, MathUtils.lerp(0.01, 0.5, amount));
      originHelper.updateWorldMatrix(true, false);
      geometry.applyMatrix4(originHelper.matrixWorld);

      const hue = MathUtils.lerp(...hueRange, amount);
      const saturation = 1;
      const lightness = MathUtils.lerp(0.4, 1.0, amount);
      color.setHSL(hue, saturation, lightness);
      const rgb = color.toArray().map(v => v * 255);
      const numVerts = geometry.getAttribute('position').count;
      const itemSize = 3; // r, g, b
      const colors = new Uint8Array(itemSize * numVerts);
      colors.forEach((v, ndx) => {
        colors[ndx] = rgb[ndx % 3];
      });
      const normalized = true;
      const colorAttrib = new BufferAttribute(colors, itemSize, normalized);
      geometry.setAttribute('color', colorAttrib);
      geometries.push(geometry);
    });
  });
  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
  return { mergedGeometry, lonHelper };

}
export { makeBoxes }
