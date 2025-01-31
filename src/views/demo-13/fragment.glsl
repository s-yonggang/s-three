// precision mediump float; // 精度设置 lowp、mediump、highp（可能会导致一些bug，由于精度不足导致）

uniform sampler2D uTexture;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;
varying float vModelY;

void main() {
  // 获取纹理颜色
  // vec4 texColor = texture2D(uTexture, vUv);

  // float time = abs(sin(uTime));

  vec3 color = mix(uColorA, uColorB, smoothstep(-1.0, 1.0, vModelY));  
  gl_FragColor = vec4(color,1.0);
}