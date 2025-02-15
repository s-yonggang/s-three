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
function addBoxs(file: any) {
  const { min, max, data } = file;
  const range = max - min;

  const lonHelper = new Object3D();
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
  const lonFudge = Math.PI * .5;
  const latFudge = Math.PI * - 0.135;
  const geometries: Array<any> = [];
  data.forEach((row: any, latNdx: any) => {

    row.forEach((value: any, lonNdx: any) => {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range;
      const boxWidth = 1;
      const boxHeight = 1;
      const boxDepth = 1;
      const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);
      // 调整辅助器使其指向经纬度
      lonHelper.rotation.y = MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
      latHelper.rotation.x = MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;
      // 使用world matrix来操作辅助器
      positionHelper.scale.set(0.005, 0.005, MathUtils.lerp(0.01, 0.5, amount));
      originHelper.updateWorldMatrix(true, false);
      geometry.applyMatrix4(originHelper.matrixWorld);


      const color = new Color();
      // 计算颜色
      const hue = MathUtils.lerp(0.7, 0.3, amount);
      const saturation = 1;
      const lightness = MathUtils.lerp(0.4, 1.0, amount);
      color.setHSL(hue, saturation, lightness);
      // 以0到255之间的值数组形式获取颜色
      const rgb = color.toArray().map(v => v * 255);

      // 创建一个数组来存储每个顶点的颜色
      const numVerts = geometry.getAttribute('position').count;
      const itemSize = 3;  // r, g, b
      const colors = new Uint8Array(itemSize * numVerts);

      // 将颜色复制到每个顶点的颜色数组中
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
  const material = new MeshBasicMaterial({
    vertexColors: true,
  });
  const mesh = new Mesh(mergedGeometry, material);
  return { lonHelper, mesh }
}

export { addBoxs }
