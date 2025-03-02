uniform sampler2D map;

varying vec2 vUv;

void main() {

  vec4 color = texture2D(map, vUv*1.0);
  gl_FragColor = vec4(color.r, color.g, color.b, 0.8);

}