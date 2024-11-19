#include ./noise3d.glsl;

uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
attribute vec3 aPositionTarget;
varying vec3 vColor;

void main() {
  // 使用噪声函数过度
  float noiseOrigin = noise3d(position * 0.2);
  float noiseTarget = noise3d(aPositionTarget * 0.2);
  float noise = mix(noiseOrigin, noiseTarget, uProgress);
  noise = smoothstep(-1.0, 1.0, noise);

  float duration = 0.8;
  float delay = (1.0 - duration) * noise;
  float end = delay + duration;
  float progress = smoothstep(delay, end, uProgress);

  vec3 mixedPoison = mix(position, aPositionTarget, progress);
  vec4 modelPosition = modelMatrix * vec4(mixedPoison, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  gl_PointSize = uSize * uResolution.y;
  gl_PointSize *= (1.0 / -viewPosition.z);

  // varying
  vColor = vec3(noise);
}