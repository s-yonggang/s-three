import { PerspectiveCamera, Vector3 } from "three";

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


function createCamera(cameraParams: cameraParamsType = defaultCameraParams, position: Vector3 = new Vector3(100, 300, 100)): PerspectiveCamera {
  const camera = new PerspectiveCamera(cameraParams.fov, cameraParams.aspect, cameraParams.near, cameraParams.far);
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  return camera;
}

export { createCamera }
