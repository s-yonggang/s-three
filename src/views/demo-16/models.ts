import {
  Group,
  Mesh,
  MeshPhongMaterial,
  MeshBasicMaterial,
  BoxGeometry,
  SRGBColorSpace,
  TextureLoader,

} from "three";
async function createModels() {

  // geometry material
  const material = new MeshPhongMaterial({ color: 0xdddddd })
  const geometry = new BoxGeometry(1, 1, 1);
  const mesh: any = new Mesh(geometry, material);

  // const group = new Group()
  // group.add(mesh);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
    mesh.rotation.x += 0.01;
    mesh.rotation.z += 0.01;
  }
  const onDestroy = () => { }
  return { mesh, onDestroy };
}

export { createModels }
