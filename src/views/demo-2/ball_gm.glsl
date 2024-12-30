varying float vIntensity;
varying vec2 vUv;
uniform sampler2D uNoiseTexture;
uniform vec3 uColor;
uniform float uTime;

void main() {
  vec2 nuv = vUv;
  nuv.y += uTime;
    // nuv.x += uTime;
  vec4 noiseColor = texture2D(uNoiseTexture, nuv);
  gl_FragColor = vec4(noiseColor.xyz * vIntensity * uColor * 2.0, 1.0);
}