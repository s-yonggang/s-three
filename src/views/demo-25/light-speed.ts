import { color, screenUV, hue, reflector, time, Fn, vec2, length, atan2, float, sin, cos, vec3, sub, mul, pow, blendDodge, normalWorld } from 'three/tsl';


// lightSpeed
const lightSpeed = /*#__PURE__*/ Fn(([suv_immutable]) => {
  // forked from https://www.shadertoy.com/view/7ly3D1
  const suv = vec2(suv_immutable);
  const uv = vec2(length(suv), atan2(suv.y, suv.x));
  const offset = float(float(.2).mul(sin(uv.y.mul(10.).sub(time.mul(.6)))).mul(cos(uv.y.mul(48.).add(time.mul(.3)))).mul(cos(uv.y.mul(3.7).add(time))));
  const rays = vec3(vec3(sin(uv.y.mul(150.).add(time)).mul(.5).add(.5)).mul(vec3(sin(uv.y.mul(80.).sub(time.mul(0.6))).mul(.5).add(.5))).mul(vec3(sin(uv.y.mul(45.).add(time.mul(0.8))).mul(.5).add(.5))).mul(vec3(sub(1., cos(uv.y.add(mul(22., time).sub(pow(uv.x.add(offset), .3).mul(60.))))))).mul(vec3(uv.x.mul(2.))));

  return rays;

}).setLayout({
  name: 'lightSpeed',
  type: 'vec3',
  inputs: [
    { name: 'suv', type: 'vec2' }
  ]
});

// background
const coloredVignette = screenUV.distance(.5).mix(hue(color(0x0175ad), time.mul(.1)), hue(color(0x02274f), time.mul(.5)));
const lightSpeedEffect = lightSpeed(normalWorld).clamp();
const lightSpeedSky = normalWorld.y.remapClamp(- .1, 1).mix(0, lightSpeedEffect);
const composedBackground = blendDodge(coloredVignette, lightSpeedSky);

export { composedBackground, reflector }
