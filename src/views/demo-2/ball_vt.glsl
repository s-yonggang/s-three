varying float vIntensity;
varying vec2 vUv;
uniform float uThickness;
void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  vec3 dirToCamera = normalize(cameraPosition - worldPosition.xyz);
  vIntensity = 1.0 - dot(worldNormal, dirToCamera);
  vIntensity = pow(vIntensity, uThickness);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}