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
  SphereGeometry,
  TorusKnotGeometry,
  AdditiveBlending,
  Color
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
async function createModels() {

  const params = {
    uTime: 0.0,
    uStrength: 1.5,
    uColorA: 0x2255ff,
    uColorB: 0xff2255,
  }

  // material
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // side: DoubleSide,
    // wireframe: true,
    uniforms: {
      uTime: { value: params.uTime },
      uStrength: { value: params.uStrength },
      uColorA: { value: new Color(params.uColorA) },
      uColorB: { value: new Color(params.uColorB) },
    },
    transparent: true,
    opacity: 0.1, // 设置透明度（0-1）
    depthWrite: false, //
    blending: AdditiveBlending
  })

  // car
  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  const [modelA] = await Promise.all([
    loader.loadAsync('./models/ferrari.glb'),
  ]);
  const carModel: any = modelA.scene.children[0];
  carModel.position.y = -2;
  for (let i = 0; i < carModel.children.length; i++) {
    for (let j = 0; j < carModel.children[i].children.length; j++) {
      carModel.children[i].children[j].material = material
    }
    console.log(carModel.children[i].name)
  }

  // torusKnotGeo
  const torusKnotGeo = new TorusKnotGeometry(0.5, 0.1, 100, 16);
  const torusKnot = new Mesh(torusKnotGeo, material);
  torusKnot.position.x = 8;
  torusKnot.position.y = -1;

  // SphereGeometry
  const geometry = new SphereGeometry(1, 32, 32);
  const mesh: any = new Mesh(geometry, material);
  mesh.position.x = -8;
  mesh.position.y = -1;

  // GUI
  const gui = new GUI();
  gui.add(material.uniforms.uStrength, 'value')
    .min(1)
    .max(2)
    .step(0.01)
    .name('uStrength');

  // gui.addColor( params, 'uColorA' );
  gui.addColor(params, 'uColorA').onChange((val: string) => {
    material.uniforms.uColorA.value = new Color(val);
  });
  gui.addColor(params, 'uColorB').onChange((val: string) => {
    material.uniforms.uColorB.value = new Color(val);
  });

  const group = new Group()
  group.add(mesh, torusKnot, carModel);
  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    material.uniforms.uTime.value = deltaTime;
  }
  const onDestroy = () => {
    gui.destroy();
    geometry.dispose();
    material.dispose();
    torusKnotGeo.dispose();
    torusKnot.geometry.dispose();
    torusKnot.material.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
    carModel.children.forEach((child: any) => {
      child.children.forEach((i)=>{
        i.geometry.dispose();
        i.material.dispose();
      })
    });
    group.clear();
  }
  return { group, onDestroy };
}

export { createModels }
