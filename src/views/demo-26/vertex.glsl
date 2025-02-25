# define PI 3.14159

// uniform mat4 modelMatrix; // 视图 modelMatrix 应用相对于网格的变换（位置旋转缩放）
// uniform mat4 viewMatrix; // 相机视图矩阵（位置、旋转、远近裁切面...）
// uniform mat4 projectionMatrix; // 投影视图矩阵
uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;
varying vec2 vUv;
varying float modelY;
varying float vStrength;
// main函数为 vertexShader 的入口函数
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec3 modelNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  vec3 dirToCamera = normalize(cameraPosition - modelPosition.xyz);
  vStrength = 1.0 - dot(modelNormal, dirToCamera);
  vStrength = pow(vStrength, 3.0);

  // float y = sin(uTime) * modelPosition.y * 0.5;
  // mat2 m2 = mat2(cos(PI / 2.0 * y), -sin(PI / 2.0 * y), sin(PI / 2.0 * y), cos(PI / 2.0 * y));
  // modelPosition.xz = modelPosition.xz * m2;
  // vec4 viewPosition = viewMatrix * modelPosition;
  // vec4 projectionPosition = projectionMatrix * viewPosition;
  // gl_Position = projectionPosition;  // 矩阵相乘的顺 序是从左至右的顺序
  gl_Position = projectionMatrix * viewMatrix * modelPosition;  // 矩阵相乘的顺 序是从左至右的顺序
  vUv = uv;
  modelY = modelPosition.y;  // 向片段着色器传递模型的 y 值
}