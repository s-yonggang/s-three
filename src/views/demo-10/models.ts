import {
  PlaneGeometry,
  Mesh,
  DoubleSide,
  RawShaderMaterial,
  BufferAttribute,
  Vector2,
  Color,
  TextureLoader
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
async function createModels() {

  const params = {
    uTime: 0,
    uSpeed: 2.0,
    uFrequency: new Vector2(2.0, 2.0),
    uAmplitude: 0.1,
    subdivision: new Vector2(100, 100),
    isWireframe: true,
    uColorA: "#0000ff",
    uColorB: "#ff0000"
  };

  const textureLoader = new TextureLoader();
  const [texture] = await Promise.all([
    textureLoader.loadAsync('./texture/brick_floor.webp'),
  ])
  console.log(texture);

  const material = new RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
    wireframe: params.isWireframe,
    uniforms: {
      uTime: { value: params.uTime },
      uSpeed: { value: params.uSpeed },
      uFrequency: { value: params.uFrequency },
      uAmplitude: { value: params.uAmplitude },
      uColorA: { value: new Color(params.uColorA) },
      uColorB: { value: new Color(params.uColorB) },
      uTexture: { value: texture },
      uIsWireframe: { value: params.isWireframe }
    }
  });

  let geometry = new PlaneGeometry(5, 5, params.subdivision.x, params.subdivision.y);
  const vertexCount = geometry.attributes.position.count;

  const aRandom = new Float32Array(vertexCount);
  for (let i = 0; i < vertexCount; i++) {
    aRandom[i] = Math.random();
  }
  geometry.setAttribute("aRandom", new BufferAttribute(aRandom, 1))
  const mesh: any = new Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);

  // GUI
  const gui = new GUI();
  gui.add(material.uniforms.uSpeed, "value").min(0.0).max(10).step(0.01).name('Speed');
  gui.add(material.uniforms.uFrequency.value, "x").min(0.0).max(10).step(0.01).name('Frequency-x');
  gui.add(material.uniforms.uFrequency.value, "y").min(0.0).max(10).step(0.01).name('Frequency-y');
  gui.add(material.uniforms.uAmplitude, "value").min(-0.3).max(0.3).step(0.01).name('uAmplitude');

  gui.add(params.subdivision, 'x', 1, 200, 1).onChange((val: number) => {
    geometry.dispose();
    geometry = new PlaneGeometry(5, 5, val, val);
    mesh.geometry = geometry;
  }).name('subdivision');

  gui.add(params, 'isWireframe').onChange((val: boolean) => {
    material.wireframe = val;
  }).name('isWireframe');


  gui.addColor(params, 'uColorA').onChange((val) => {
    material.uniforms.uColorA.value.set(val);
  })
  gui.addColor(params, 'uColorB').onChange((val) => {
    material.uniforms.uColorB.value.set(val);
  })

  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    material.uniforms.uTime.value = deltaTime;
  }

  const onDestroy = () => {
    gui.destroy();
    geometry.dispose();
    material.dispose();
    mesh.geometry.dispose();
    texture.dispose();
  }

  return { mesh, onDestroy };
}

export { createModels }
