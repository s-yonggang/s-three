// uniform mat4 modelMatrix; // 视图 modelMatrix 应用相对于网格的变换（位置旋转缩放）
// uniform mat4 viewMatrix; // 相机视图矩阵（位置、旋转、远近裁切面...）
// uniform mat4 projectionMatrix; // 投影视图矩阵

// attribute vec3 position;
// attribute vec2 uv;
uniform sampler2D map;

uniform float width;
uniform float height;
uniform float nearClipping, farClipping;

uniform float pointSize;
uniform float zOffset;

varying vec2 vUv;

const float XtoZ = 1.11146; // tan( 1.0144686 / 2.0 ) * 2.0;
const float YtoZ = 0.83359; // tan( 0.7898090 / 2.0 ) * 2.0;

void main() {

  vUv = vec2(position.x / width, position.y / height);

  vec4 color = texture2D(map, vUv);
  float depth = (color.r + color.g + color.b) / 3.0;

	// Projection code by @kcmic
  float z = (1.0 - depth) * (farClipping - nearClipping) + nearClipping;
  vec4 pos = vec4((position.x / width - 0.5) * z * XtoZ, (position.y / height - 0.5) * z * YtoZ, -z + zOffset, 1.0);
  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * modelViewMatrix * pos;

}