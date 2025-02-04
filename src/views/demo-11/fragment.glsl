#include ../../assets/noise-simplex/noise2d.glsl;

# define PI 3.141592653589793

precision mediump float; // 精度设置 lowp、mediump、highp（可能会导致一些bug，由于精度不足导致）

uniform int uIndex;
uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

// 随机数
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 旋转
vec2 rotate(vec2 uv, float rotation, vec2 center) {
  float x = cos(rotation) * (uv.x - center.x) + sin(rotation) * (uv.y - center.y) + center.x;
  float y = cos(rotation) * (uv.y - center.y) - sin(rotation) * (uv.x - center.x) + center.y;
  return vec2(x, y);
}
vec4 test0() {
  return texture2D(uTexture, vUv);
}

vec4 test1() {
  float strength = vUv.x;
  // float strength = vUv.y;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test2() {
  float strength = mod(vUv.x * 10.0, 1.0);
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test3() {
  float strength = step(0.5, floor(mod(vUv.y * 10.0, 1.0) * 10.0) / 10.0);
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test4() {
  float row = step(0.8, mod(vUv.x * 10.0, 1.0));
  float column = step(0.8, mod(vUv.y * 10.0, 1.0));
  float strength = row + column;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test5() {
  float row = step(0.8, mod(vUv.x * 10.0, 1.0));
  float column = step(0.8, mod(vUv.y * 10.0, 1.0));
  float strength = row * column;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test6() {
  float x = step(mod(vUv.x * 10.0, 1.0), 0.2) * step(mod(vUv.y * 10.0, 1.0), 0.4);
  float y = step(mod(vUv.x * 10.0, 1.0), 0.4) * step(mod(vUv.y * 10.0, 1.0), 0.2);
  float strength = x + y;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test7() {
  float x = step(mod(vUv.x * 10.0 + 0.7, 1.0), 0.2) * step(mod(vUv.y * 10.0, 1.0), 0.8);
  float y = step(mod(vUv.y * 10.0 + 0.7, 1.0), 0.2) * step(mod(vUv.x * 10.0, 1.0), 0.8);
  float strength = x + y;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test8() {
  float strength = abs(vUv.y - 0.5);
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test9() {
  float x = abs(vUv.x - 0.5);
  float y = abs(vUv.y - 0.5);
  float strength = min(x, y);
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test10() {
  float x = abs(vUv.x - 0.5);
  float y = abs(vUv.y - 0.5);
  float strength = step(0.4, max(x, y));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test11() {
  float strength = ceil(vUv.x * 10.0) / 10.0;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test12() {
  float strength = random(vUv);
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test13() {
  float x = ceil(vUv.x * 10.0) / 10.0;
  float y = ceil((vUv.y + vUv.x / 2.0) * 10.0) / 10.0;
  float strength = random(vec2(x, y));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
  // float x = ceil(vUv.x * 10.0) / 10.0;
  // float y = ceil(vUv.y * 10.0) / 10.0;
  // float strength = random(vec2(x, y));
  // vec4 map = vec4(strength, strength, strength, 1.0);
  // return map;
}

vec4 test14() {
  // float strength = length(vUv - 0.5);
  float strength = distance(vUv, vec2(0.5, 0.5));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test15() {
  // float strength = length(vUv - 0.5);
  float strength = 0.05 / distance(vUv, vec2(0.5));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test16() {
  vec2 light = vec2(vUv.x * 0.2 + 0.4, vUv.y);
  float strength = 0.05 / distance(light, vec2(0.5));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test17() {
  vec2 lightUvX = vec2(vUv.x * 0.2 + 0.4, vUv.y);
  float lightX = 0.02 / distance(lightUvX, vec2(0.5));
  vec2 lightUvY = vec2(vUv.x, vUv.y * 0.2 + 0.4);
  float lightY = 0.02 / distance(lightUvY, vec2(0.5));
  float strength = lightX * lightY + 0.1;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test18() {
  vec2 rotationUv = rotate(vUv, PI * 0.25, vec2(0.5));
  vec2 lightUvX = vec2(rotationUv.x * 0.2 + 0.4, rotationUv.y);
  float lightX = 0.02 / distance(lightUvX, vec2(0.5));
  vec2 lightUvY = vec2(rotationUv.x, rotationUv.y * 0.2 + 0.4);
  float lightY = 0.02 / distance(lightUvY, vec2(0.5));
  float strength = lightX * lightY + 0.1;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test19() {
  float strength = step(0.2, distance(vUv, vec2(0.5)));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test20() {
  float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test21() {
  float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test22() {
  vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
  float strength = step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test23() {
  float radian = atan(vUv.x, vUv.y);
  float strength = radian;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test24() {
  float radian = atan(vUv.x - 0.5, vUv.y - 0.5);
  radian /= PI * 2.0;
  radian += 0.5;
  float strength = radian;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test25() {
  float radian = atan(vUv.x - 0.5, vUv.y - 0.5);
  radian /= PI * 2.0;
  radian *= 10.0;
  radian = mod(radian, 0.5);
  radian = step(radian, 0.25);
  float strength = radian;
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test26() {
  float radian = atan(vUv.x - 0.5, vUv.y - 0.5);
  radian /= PI * 2.0;
  // radian += 0.5;
  radian = sin(radian * 100.0) * 0.02 + 0.25;

  float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radian));
  vec4 map = vec4(strength, strength, strength, 1.0);
  return map;
}

vec4 test27() {
  float strength = sin(noise2d(vUv * 5.0) * 20.0);
  vec3 colorA = vec3(vUv, 1.0);
  vec3 colorB = vec3(1.0, vUv);
  vec4 map = vec4(mix(colorA, colorB, strength), 1.0);
  return map;
}

vec4 test28() {
  float time = mod(uTime * 0.2, 1.0);
  float strengthA = 0.5;
  float strengthB = distance(vec2(vUv.y, vUv.y), vec2(time));
  float strength = strengthA + step(strengthB, 0.05);

  vec4 map = vec4(vec3(strength), 1.0);
  return map;
}

vec4 test29() {
  float strength = smoothstep(0.0,1.0,abs(vUv.x-0.5));
  vec4 map = vec4(vec3(step(0.1,strength)), 1.0);
  return map;
}

const int size = 40;
vec4 exampleFnArr[size];

void main() {

  // 示例
  exampleFnArr[0] = test0();
  exampleFnArr[1] = test1();
  exampleFnArr[2] = test2();
  exampleFnArr[3] = test3();
  exampleFnArr[4] = test4();
  exampleFnArr[5] = test5();
  exampleFnArr[6] = test6();
  exampleFnArr[7] = test7();
  exampleFnArr[8] = test8();
  exampleFnArr[9] = test9();
  exampleFnArr[10] = test10();
  exampleFnArr[11] = test11();
  exampleFnArr[12] = test12();
  exampleFnArr[13] = test13();
  exampleFnArr[14] = test14();
  exampleFnArr[15] = test15();
  exampleFnArr[16] = test16();
  exampleFnArr[17] = test17();
  exampleFnArr[18] = test18();
  exampleFnArr[19] = test19();
  exampleFnArr[20] = test20();
  exampleFnArr[21] = test21();
  exampleFnArr[22] = test22();
  exampleFnArr[23] = test23();
  exampleFnArr[24] = test24();
  exampleFnArr[25] = test25();
  exampleFnArr[26] = test26();
  exampleFnArr[27] = test27();
  exampleFnArr[28] = test28();
  exampleFnArr[29] = test29();
  gl_FragColor = exampleFnArr[uIndex];
}