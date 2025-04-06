import {
  PlaneGeometry,
  BoxGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  MeshStandardMaterial
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
async function createModels() {
  const group = new Group()

  // 创建高细分平面
  const widthSegments = 64; // 高分段确保平滑
  const heightSegments = 1;
  const geometry = new PlaneGeometry(10, 2, widthSegments, heightSegments);
  const material = new MeshStandardMaterial({
    color: 0x2194ce,
    side: DoubleSide,
    metalness: 0.3,
    roughness: 0.8
  });
  const plane = new Mesh(geometry, material);

  // 弯曲参数
  const radius:number = 5; // 弯曲半径（越小弯曲越明显）
  const bendAxis = 'x'; // 弯曲轴（x 或 z）

  // 弯曲平面顶点
  function bendGeometry(geometry, radius:number, bendAxis = 'x') {
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      if (bendAxis === 'x') {
        // 沿X轴弯曲成圆柱
        const theta = x / radius; // 角度 = 弧长 / 半径
        positions[i] = Math.sin(theta) * radius;     // 新X
        positions[i + 2] = Math.cos(theta) * radius - radius; // 新Z
      } else if (bendAxis === 'z') {
        // 沿Z轴弯曲
        const theta = z / radius;
        positions[i] = Math.sin(theta) * radius;
        positions[i + 2] = Math.cos(theta) * radius - radius;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // 重新计算法线
  }

  // 初始弯曲
  bendGeometry(geometry, radius, bendAxis);

  group.add(plane);
  // animation
  plane.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
    // radius = 3 + Math.sin(delta) * 2;
    // bendGeometry(geometry, radius, bendAxis);
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
