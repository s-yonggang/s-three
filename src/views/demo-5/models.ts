import {
  SphereGeometry,
  MeshStandardMaterial,
  DoubleSide,
  Mesh
} from "three";
// import { createLabelDiv, createLabelLine } from '@/components/WorldLabelRenderer'

function createModels() {
  // Material
  const material = new MeshStandardMaterial({ color: 0xffffff, side: DoubleSide });

  // geometry
  const geometry = new SphereGeometry(2, 32, 32);

  const mesh: any = new Mesh(geometry, material)


  // animation
  // const radiansPerSecond = MathUtils.degToRad(10);
  mesh.tick = (delta: any, deltaTime: any) => {
    // uniforms.uTime.value = deltaTime;
    // console.log(uniforms.uTime.value)
    // terrain.rotation.x += radiansPerSecond * delta;
    // terrain.rotation.y += radiansPerSecond * delta;
    // terrain.rotation.z += radiansPerSecond * delta;
  }
  return { mesh };
}

export { createModels }
