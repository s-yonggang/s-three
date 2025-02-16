import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Matrix4,
} from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import GUI from "lil-gui";
async function createModels() {

  // plane geometry material
  const material = new MeshBasicMaterial({
    color: 0x44aa88,
    wireframe: false,
    // vertexColors: THREE.FaceColors,
    // side: THREE.DoubleSide,
  });

  const geometries = []
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const boxWidth = 0.2;
      const boxHeight = Math.random()*2;
      const boxDepth = 0.2;
      const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);
      // 创建平移矩阵
      const translationMatrix = new Matrix4().makeTranslation(i-50, 0, j-50);
      // 应用平移矩阵到geometry
      geometry.applyMatrix4(translationMatrix)
      // geometry.setAttribute('color', colorAttrib);
      geometries.push(geometry)
    }

  }
  const mergeGeometry = BufferGeometryUtils.mergeGeometries(geometries, false)

  // geometry.rotateX(-Math.PI / 2);
  const mesh: any = new Mesh(mergeGeometry, material);

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
