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
  aspect: 0.88,  // window.innerWidth / window.innerHeight
}


function createCamera(cameraParams: cameraParamsType = defaultCameraParams): PerspectiveCamera {
  const camera = new PerspectiveCamera(cameraParams.fov, cameraParams.aspect, cameraParams.near, cameraParams.far);
  return camera;
}

export { createCamera }
