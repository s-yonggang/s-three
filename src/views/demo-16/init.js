import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
async function init(data) {

  const { canvas, inputElement } = data;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  // state.width = canvas.width;
  // state.height = canvas.height;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const fov = 60;
  const aspect = inputElement.clientWidth / inputElement.clientHeight;
  const near = 0.01;
  const far = 2000;
  const camera = createCamera({ fov, aspect, near, far });
  camera.position.z = 6;

  const controls = new OrbitControls(camera, inputElement);
  controls.target.set(0, 0, 0);
  controls.update();

  const material = new THREE.MeshPhongMaterial({ color: 0xdddddd })
  const geometry = new THREE.SphereGeometry(2, 64, 32);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.tick = () => {
    mesh.rotation.y += 0.004;
  }

  const { directionalLight, ambientLight } = createLights()
  scene.add(mesh, directionalLight, ambientLight);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = inputElement.clientWidth;
    const height = inputElement.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    // time *= 0.001;
    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = inputElement.clientWidth / inputElement.clientHeight;
      camera.updateProjectionMatrix();
    }
    // if (state.textureData) {
    //   mesh.material.map = state.textureData;
    //   material.needsUpdate = true;
    //   state.textureData = null;
    // }
    mesh.tick();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render()
}

export { init }
