import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera: any, canvas: any) {
  const controls: any = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.tick = () => controls.update();
  return controls;
}

export { createControls };
