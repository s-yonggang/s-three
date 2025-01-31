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
  Color
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
async function createModels() {


  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
    // opacity: 0.1
    wireframe: true,
    uniforms: {
      uTime: { value: 0.0 },
      uTexture: { value: null },
      uColorA: { value: new Color("#0000ff") },
      uColorB: { value: new Color("#ff0000") },
    }
  })

  // plane geometry material
  const geometry = new PlaneGeometry(10, 5, 200, 200);
  geometry.rotateX(-Math.PI / 2);
  const mesh: any = new Mesh(geometry, material);
  // mesh.position.set(0, 2, 0);
  const group = new Group()
  group.add(mesh);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    material.uniforms.uTime.value = deltaTime;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
