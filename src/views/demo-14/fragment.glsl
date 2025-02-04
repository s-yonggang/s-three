uniform float time;
varying vec2 vUv;
uniform vec3 glow_color;
uniform vec3 glow_color2;
// varying float intensity;
varying vec3 vPosition;
void main() {
  vec3 glow = glow_color * 1.0;
  vec3 glow2 = glow_color2 * 1.0;
  vec3 glow3 = mix(glow, glow2, 1.0);

  float light = 0.0;
  float now = smoothstep(0.0, 0.3, fract(time));
  float alpha = mod((vUv.y - now) * 1.0, 1.0);

  if(-0.005 < now - vUv.y && now - vUv.y < 0.005) {
    if(now == 1.0) {
      light = 0.0;
    } else {
      light += 0.5;
    }
  }
  gl_FragColor = vec4(glow3 + light, alpha);
}