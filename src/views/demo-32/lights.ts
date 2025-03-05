import {
  SpotLight,
  AmbientLight,
  DirectionalLight,
  PointLight,
  CameraHelper,
  SpotLightHelper,
  PointLightHelper,
  DirectionalLightHelper,
} from 'three';

function createLights() {

  // 自然光
  const ambientLight = new AmbientLight(0xffffff, 0.6// intensity
  );

  // 点光源
  const pointLight = new PointLight(0xffffff, 100, 40, 1);
  pointLight.position.set(-20, -20, -20);
  pointLight.castShadow = true; // default false

  // 平行光
  const directionalLight = new DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(40, 40, 40).multiplyScalar( 50 );
  directionalLight.shadow.mapSize.width = 512 * 2;
  directionalLight.shadow.mapSize.height = 512 * 2;
  // pointLight.shadow.camera.near = 0.1;
  // pointLight.shadow.camera.far = 40;
  directionalLight.castShadow = true; // default false

  // 聚光灯
  const spotLight = new SpotLight(0xffffff, 1, 240, Math.PI / 5, 0, 0);
  spotLight.position.set(1, 4, 2);
  spotLight.castShadow = true; // default false

  const helper = new CameraHelper(directionalLight.shadow.camera);
  const sphereSize = 1;

  const pointLightHelper = new PointLightHelper(pointLight, sphereSize);
  const directionalLightHelper = new DirectionalLightHelper(directionalLight, sphereSize);
  const spotLightHelper = new SpotLightHelper(spotLight);

  return { ambientLight, directionalLight, pointLight, spotLight, helper, pointLightHelper, directionalLightHelper, spotLightHelper };
}

export { createLights };
