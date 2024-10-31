varying float vWobble;
void main() {

  vec3 colorA = vec3(1.0, 1.0, 0.0);
  vec3 colorB = vec3(1.0, 0.0, 0.0);
  float colorMix = smoothstep(-1.0, 1.0, vWobble);
  // csm_Metalness = 0.1;
  // csm_Roughness = 0.8;
  csm_DiffuseColor.rgb = mix(colorA, colorB, colorMix);
}