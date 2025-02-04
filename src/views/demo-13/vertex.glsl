#include ../../assets/noise-simplex/noise2d.glsl;

# define PI 3.14159

// uniform mat4 modelMatrix; // 视图 modelMatrix 应用相对于网格的变换（位置旋转缩放）
// uniform mat4 viewMatrix; // 相机视图矩阵（位置、旋转、远近裁切面...）
// uniform mat4 projectionMatrix; // 投影视图矩阵
uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;
varying vec2 vUv;
varying float vModelY;

// main函数为 vertexShader 的入口函数
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float noise = noise2d(vec2(modelPosition.x * 2.0, modelPosition.z * 2.0 - uTime * 0.5)) * 0.2;
  float roadWidth = abs(modelPosition.x);
  // float roadWidth = modelPosition.x;

  float trans = smoothstep(0.01, 0.8, noise);

  modelPosition.y = mix(0.0, trans, step(0.5, roadWidth));


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;  // 矩阵相乘的顺序是从左至右的顺序
  vUv = uv;
  vModelY = modelPosition.y;  // 向片段着色器传递模型的 y 值
}