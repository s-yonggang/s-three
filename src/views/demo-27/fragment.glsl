// precision mediump float; // 精度设置 lowp、mediump、highp（可能会导致一些bug，由于精度不足导致）

uniform sampler2D uTexture;
uniform float uTime;
uniform float uStrength;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vPosition;
varying vec3 vNormal; // 法线向量
void main() {
  vec3 normal = normalize(vNormal);

  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(viewDirection*uStrength, normal) + 1.0;
  vec3 mixColor = mix(uColorA,uColorB,0.5);
  vec4 color = vec4(mixColor, fresnel);
  gl_FragColor = color;
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}