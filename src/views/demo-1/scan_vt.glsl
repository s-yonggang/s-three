varying vec2 vUv;
uniform float time;

void main() {
  vUv = uv;

  vec3 transformed = position;

  vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * viewPosition;
}