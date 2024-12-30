// uniform mat4 modelMatrix; // 视图 modelMatrix 应用相对于网格的变换（位置旋转缩放）
// uniform mat4 viewMatrix; // 相机视图矩阵（位置、旋转、远近裁切面...）
// uniform mat4 projectionMatrix; // 投影视图矩阵

// attribute vec3 position;
// attribute vec2 uv;
varying vec2 vUv;

// main函数为 vertexShader 的入口函数
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  // 矩阵相乘的顺序是从左至右的顺序
  gl_Position = projectionPosition;
  vUv = uv;
}