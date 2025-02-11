import {
  Vector3,
  PlaneGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Color
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


async function createModels(container: any) {
  const wheels: Array<any> = [];

  const bodyMaterial = new MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03
  });

  const detailsMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5
  });

  const glassMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0
  });

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
  console.log(carModel)
  carModel.getObjectByName( 'body' ).material = bodyMaterial;
  carModel.getObjectByName( 'lights' ).material = bodyMaterial;
  carModel.getObjectByName( 'lights_red' ).material = bodyMaterial;

  carModel.getObjectByName('rim_fl').material = detailsMaterial;
  carModel.getObjectByName('rim_fr').material = detailsMaterial;
  carModel.getObjectByName('rim_rr').material = detailsMaterial;
  carModel.getObjectByName('rim_rl').material = detailsMaterial;
  carModel.getObjectByName('trim').material = detailsMaterial;
  carModel.getObjectByName('glass').material = glassMaterial;
  wheels.push(
    carModel.getObjectByName('wheel_fl'),
    carModel.getObjectByName('wheel_fr'),
    carModel.getObjectByName('wheel_rl'),
    carModel.getObjectByName('wheel_rr')
  );

  const gui: GUI = new GUI();
  gui.addColor(bodyMaterial, 'color').name('bodyMaterial');
  gui.addColor(glassMaterial, 'color').name('glassMaterial');
  gui.addColor(detailsMaterial, 'color').name('detailsMaterial');


  const lineLeft: any = new MeshLineGeometry()
  lineLeft.setPoints([
    new Vector3(-0.4, 0.01, 3),
    new Vector3(-0.4, 0.01, -3),
  ])

  const lineRight: any = new MeshLineGeometry()
  lineRight.setPoints([
    new Vector3(0.4, 0.01, 3),
    new Vector3(0.4, 0.01, -3),
  ])

  const lineMaterial = new MeshLineMaterial({
    side: DoubleSide,
    // color: new Color(0xffffff * Math.random()),
    lineWidth: 0.02,
    dashArray: 0.1,
    dashOffset: 3,
    transparent: true,
    toneMapped: false,
    dashRatio: 0.5,
    depthWrite: false
  })

  const line2 = new Mesh(lineLeft, lineMaterial);
  const line3 = new Mesh(lineRight, lineMaterial);

  // shadow
  // const shadow = new TextureLoader().load('./texture/ferrari_ao.png');
  // const shadowMesh = new Mesh(
  //   new PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
  //   new MeshBasicMaterial( {
  //     map: shadow, blending: MultiplyBlending, toneMapped: false, transparent: true
  //   } )
  // );
  // shadowMesh.rotation.x = - Math.PI / 2;
  // shadowMesh.renderOrder = 2;
  // carModel.add( shadowMesh );

  carModel.scale.set(0.1, 0.1, 0.1);
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // side: DoubleSide,
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
  const geometry = new PlaneGeometry(10, 6, 200, 200);
  geometry.rotateX(-Math.PI / 2);
  const mesh: any = new Mesh(geometry, material);
  // mesh.position.set(0, 2, 0);
  const group = new Group()
  group.add(mesh, carModel, line2, line3);

  let speed:any = 1;
  container.addEventListener('pointerdown',()=>{
    speed = speed*10;
  })
  container.addEventListener('pointerup',()=>{
    speed = speed/10;
  })


  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    lineMaterial.dashOffset = deltaTime * 0.02 * speed;
    material.uniforms.uTime.value = deltaTime * speed;
    for (let i = 0; i < wheels.length; i++) {
      wheels[i].rotation.x = -deltaTime * speed;
    }
  }

  const onDestroy = () => {
    gui.destroy();
    carModel.remove(mesh);
  }
  return { group, onDestroy };
}

export { createModels }
