import {
  PlaneGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  TorusGeometry,
  Group,
  Mesh,
  Vector2,
  Vector3,
  DoubleSide,
  CubicBezierCurve,
  CubicBezierCurve3,
  Color,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GUI } from "lil-gui"
// import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
async function createModels(scene: any, camera: any, renderer: any) {

  const torusGeo = new TorusGeometry(1, 0.4, 16, 100);
  const torusMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.2,
    // clearcoat: 0.1,
    clearcoatRoughness: 0.05,
  });
  const torus: any = new Mesh(torusGeo, torusMaterial);



  // const gui = new GUI();


  const group = new Group()
  group.add(torus)

  torus.tick = () => {
    // composer.render();
    // console.log('++++')
  }
  const onDestroy = () => {
    torus.geometry.dispose();
    torus.material.dispose();
    group.remove(torus);
    group.clear();
  }
  return { group, onDestroy };

}

export { createModels }
