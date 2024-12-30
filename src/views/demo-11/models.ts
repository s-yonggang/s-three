import {
  PlaneGeometry,
  SphereGeometry,
  Group,
  Points,
  PointsMaterial,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
async function createModels() {

  const textureLoader = new TextureLoader()
  const [texture] = await Promise.all([
    textureLoader.loadAsync('./texture/uv_grid_opengl.jpg'),
  ])
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  // Mesh geometry material


  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uIndex: { value: 0 },
      uTexture: { value: texture },
      uTime: { value: 0 },
    },
    side: DoubleSide,
    transparent: true,
    // opacity: 0.1
  })

  // plane geometry material
  const geometry = new PlaneGeometry(2, 2, 32, 32);
  geometry.rotateX(-Math.PI / 2);
  const mesh: any = new Mesh(geometry, material);

  // SphereGeometry
  const sphereGeometry = new SphereGeometry(1, 32, 32);
  const sphere = new Mesh(sphereGeometry, material);
  sphere.position.set(0, 0, -2.5)

  // GUI
  const testNum = 29;
  const params: any = {}
  const gui = new GUI({ width: 120 });
  for (let i = 0; i < testNum; i++) {
    params[`setIndex${i}`] = () => {
      material.uniforms.uIndex.value = i;
    }
    gui.add(params, `setIndex${i}`);
  }

  const group = new Group()
  group.add(mesh);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    material.uniforms.uTime.value = deltaTime;
  }

  const onDestroy = ()=>{
    gui.destroy();
  }

  return { group,onDestroy };
}

export { createModels }
