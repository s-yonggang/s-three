import { Vector3, Mesh, Matrix4 } from "three"
/**
 * 从几何体中计算路径
 * @param mesh geo
 * @param verticesPerStep 横截面顶数
 * @returns  Vector3[]
 */
function extractPathFromGeometry(mesh: Mesh, verticesPerStep: number): Vector3[] {
  const vertices = mesh.geometry.attributes.position.array;
  const pathPoints: Vector3[] = [];
  // 遍历顶点，按每个截面的顶点数分组
  for (let i = 0; i < vertices.length; i += verticesPerStep * 3) {
    let xSum = 0, ySum = 0, zSum = 0;
    const end = i + verticesPerStep * 3;
    for (let j = i; j < end; j += 3) {
      xSum += vertices[j];
      ySum += vertices[j + 1];
      zSum += vertices[j + 2];
    }
    // 计算截面中心点
    const center: Vector3 = new Vector3(
      xSum / verticesPerStep,
      ySum / verticesPerStep,
      zSum / verticesPerStep
    );
    if (!(xSum / verticesPerStep)) break
    pathPoints.push(center);
  }
  return pathPoints;
}
export { extractPathFromGeometry }
