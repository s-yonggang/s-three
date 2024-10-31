import {
  SpotLight,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  CameraHelper,
  SpotLightHelper,
  PointLightHelper,
  DirectionalLightHelper,
  Vector2
} from 'three';

function createLights() {
  // const ambientLight = new AmbientLight('white', 2);

  // 自然光
  const ambientLight = new AmbientLight(0xffffff, 0.6// intensity
  );

  // 点光源
  const pointLight = new PointLight(0xffffff, 100, 40, 1);
  pointLight.position.set(0, 30, 0);
  pointLight.castShadow = true; // default false
  // pointLight.shadow.mapSize.width = 512; // default
  // pointLight.shadow.mapSize.height = 512; // default
  // pointLight.shadow.camera.near = 1; // default
  // pointLight.shadow.camera.far = 10; // default
  // pointLight.shadow.bias = 0.2;
  // pointLight.shadow.blurSamples = 20;
  // console.log(pointLight.shadow);


  // 平行光
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(40, 100, 0);
  directionalLight.castShadow = true; // default false

  // 聚光灯
  const spotLight = new SpotLight(0xffffff, 1, 240, Math.PI / 5, 0, 0);
  spotLight.position.set(4, 140, 80);
  spotLight.castShadow = true; // default false
  // console.log(spotLight.shadow)
  spotLight.shadow.mapSize.width = 512 * 4;  // default
  spotLight.shadow.mapSize.height = 512 * 4; // default
  // spotLight.shadow.camera.near = 0.5;    // default
  // spotLight.shadow.camera.far = 500      // default
  // spotLight.shadow.focus = 1;            // default

  const helper = new CameraHelper(directionalLight.shadow.camera);
  const sphereSize = 1;

  const pointLightHelper = new PointLightHelper(pointLight, sphereSize);
  const directionalLightHelper = new DirectionalLightHelper(directionalLight, sphereSize);
  const spotLightHelper = new SpotLightHelper(spotLight);

  return { ambientLight, directionalLight, pointLight, spotLight, helper, pointLightHelper, directionalLightHelper, spotLightHelper };
}

export { createLights };
