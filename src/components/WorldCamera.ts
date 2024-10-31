import { PerspectiveCamera } from "three";

interface cameraParamsType {
  fov: number;
  near: number;
  far: number;
  aspect: number;
}

const defaultCameraParams: cameraParamsType = {
  fov: 75,
  near: 0.01,
  far: 2000,
  aspect: window.innerWidth / window.innerHeight,
}


function createCamera(cameraParams: cameraParamsType = defaultCameraParams, position: [number, number, number] = [100, 400, 100]): PerspectiveCamera {
  const camera = new PerspectiveCamera(cameraParams.fov, cameraParams.aspect, cameraParams.near, cameraParams.far);
  camera.position.set(...position);
  // const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  // camera.position.set(-1.5, 1.5, 6.5);
  return camera;
}

export { createCamera }
