precision lowp float; // 精度设置 lowp、mediump、highp（可能会导致一些bug，由于精度不足导致）

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform sampler2D uTexture;
uniform bool uIsWireframe;

varying float vModelPosition;
varying float vRandom;
varying vec2 vUv;

void main() {

  vec3 color = mix(uColorA, uColorB, smoothstep(-1.0, 1.0, vModelPosition));
  gl_FragColor = vec4(color, 1.0);

  // vec4 texture = texture2D(uTexture, vUv);
  // gl_FragColor = texture;

  // gl_FragColor = vec4(vRandom, vRandom, 1.0, 1.0);
}