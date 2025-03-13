// precision mediump float; // 精度设置 lowp、mediump、highp（可能会导致一些bug，由于精度不足导致）

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;
varying float modelY;

void main() {
  // 获取纹理颜色
  // vec4 texColor = texture2D(uTexture, vUv);

  // float time = abs(sin(uTime));
  // float strengthA = 1.0 - length(sin(vUv.y - time))*2.0;
  // float strengthB = mix(strengthA,0.5,0.5);

  float time = mod(uTime*0.2,1.0);
  float strengthA = 0.4;
  float strengthB = distance(vec2(vUv.y,vUv.y), vec2(time));
  float strength = strengthA + step(strengthB,0.02);

  vec4 color = vec4(strength/2.0,strength/2.0,strength,1.0);
  
  gl_FragColor = color;
}