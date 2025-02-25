import {
  PlaneGeometry,
  BoxGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  SphereGeometry
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
async function createModels() {

  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
    // wireframe: true,
    uniforms: {
      uTime: { value: 0.0 }
    },
    transparent: true,
    opacity: 0.5 // 设置透明度（0-1）
  })

  const geometry = new SphereGeometry(2.5,32,32);
  const mesh: any = new Mesh(geometry, material);
  const group = new Group()
  group.add(mesh);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    material.uniforms.uTime.value = deltaTime;
  }
  const onDestroy = () => {}
  return { group, onDestroy };
}

export { createModels }
