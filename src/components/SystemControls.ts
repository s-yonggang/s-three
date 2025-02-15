import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera: any, canvas: any, labelRenderer: any = null): OrbitControls {
  const controls: any = labelRenderer ? new OrbitControls(camera, labelRenderer) : new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.tick = () => controls.update();
  return controls;
}

export { createControls };
