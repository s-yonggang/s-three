varying vec2 vUv;
uniform vec3 view_vector;
uniform float c;
uniform float p;
uniform float time;
varying vec3 vPosition;
varying float intensity;
void main() {
  vUv = uv;
  vec3 v_normal = normalize(normalMatrix * normal);
  vec3 v_view = normalize(normalMatrix * view_vector);
  float c2 = c * abs(sin(time / 10.0) / 10.0) + c;
  intensity = pow(c2 - dot(v_normal, v_view), p);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}