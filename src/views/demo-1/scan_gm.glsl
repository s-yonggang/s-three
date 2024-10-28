varying vec2 vUv;
uniform float scale;
uniform vec3 color1;
uniform vec3 color2;

void main() {

  float dis = distance(vUv, vec2(0.5, 0.5));

  float opacity = smoothstep(0.4 * scale, 0.5 * scale, dis);
  opacity *= step(dis, 0.5 * scale);
  opacity -= (scale - 0.8) * 5.0 * step(0.8, scale);

  vec3 disColor = color1 - color2;
  vec3 color = color2 + disColor * scale;

    // if(dis > 0.5 * scale){ // if语句影响性能
    //     discard;
    // }

  gl_FragColor = vec4(color, opacity);
}