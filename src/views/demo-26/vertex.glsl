// uniform mat4 modelMatrix; // 视图 modelMatrix 应用相对于网格的变换（位置旋转缩放）
// uniform mat4 viewMatrix; // 相机视图矩阵（位置、旋转、远近裁切面...）
// uniform mat4 projectionMatrix; // 投影视图矩阵
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Final position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // normal 物体模型的法线向量
  // normalModel
  vec4 normalModel = modelMatrix * vec4(normal, 0.0);

  // varying
  vPosition = modelPosition.xyz;
  vNormal = normalModel.xyz;
}