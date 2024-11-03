vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
  -0.577350269189626,  // -1.0 + 2.0 * C.x
  0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

// Compute final noise value at P
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 120.0 * dot(m, g);
  // return 100.0 * dot(m, g);
}
/**-----------------------------------------------------------------------*/

uniform float uTime;
uniform float uPositionFrequency;
uniform float uWrapFrequency;
uniform float uStrength;
uniform float uWrapStrength;
varying vec3 vPosition;
float elevation = 0.0;
float getElevation(vec2 position) {
  vec2 wrapedPosition = position;
  // wrapedPosition += uTime * 0.2;
  wrapedPosition += snoise2D(wrapedPosition * uPositionFrequency * uWrapFrequency) * uWrapStrength;

  elevation += snoise2D(wrapedPosition * uPositionFrequency) / 2.0;
  elevation += snoise2D(wrapedPosition * uPositionFrequency * 2.0) / 4.0;
  elevation += snoise2D(wrapedPosition * uPositionFrequency * 4.0) / 8.0;

  float elevationSion = sign(elevation);
  elevation = pow(abs(elevation), 2.0) * elevationSion;
  return elevation *= uStrength;
}

void main() {

  float shift = 0.01;
  vec3 positionA = position + vec3(shift, 0.0, 0.0);
  vec3 positionB = position + vec3(0.0, 0.0, shift);

  float elevation = getElevation(csm_Position.xz);
  csm_Position.y += elevation;
  positionA.y = getElevation(positionA.xz);
  positionB.y = getElevation(positionB.xz);

  vec3 directionA = normalize(positionA - csm_Position);
  vec3 directionB = normalize(positionB - csm_Position);

  csm_Normal = (directionA, directionB);

  vPosition = csm_Position;
  // vPosition.xz += uTime * 0.2;
}