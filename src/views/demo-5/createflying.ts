import {
  Vector3, QuadraticBezierCurve3,
  BufferGeometry,
  Color,
  BufferAttribute,
  LineBasicMaterial,
  Line,
  MeshBasicMaterial,
  SphereGeometry,
  Mesh
} from "three";
function createFlyLine(start: any, end: any) {
  // 1. 创建贝塞尔曲线路径
  const mid = new Vector3(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2 + 5,  // 抬高中间点形成弧线
    (start.z + end.z) / 2
  );
  const curve = new QuadraticBezierCurve3(start, mid, end);

  // 2. 生成路径点
  const points = curve.getPoints(50);

  // 3. 创建几何体
  const geometry = new BufferGeometry();
  const positions = new Float32Array(points.length * 3);
  const colors = new Float32Array(points.length * 3);

  const colorStart = new Color(0x00ff00); // 起始颜色
  const colorEnd = new Color(0xff0000);    // 结束颜色

  points.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;

    // 颜色渐变
    const color = colorStart.clone().lerp(colorEnd, i / points.length);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  });

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  // 4. 创建材质
  const material = new LineBasicMaterial({
    vertexColors: true,
    linewidth: 2
  });

  return new Line(geometry, material);
}

// 创建移动光点
function createLightPoint() {
  const geometry = new SphereGeometry(0.2, 16, 16);
  const material = new MeshBasicMaterial({ color: 0xffff00 });
  return new Mesh(geometry, material);
}

export { createFlyLine, createLightPoint }
