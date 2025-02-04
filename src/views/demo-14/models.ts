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
  SpriteMaterial,
  Sprite,
  AdditiveBlending,
  Color
} from "three";
import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
async function createModels(camera:any) {
  // 模型加载
  // gltf-格式-模型压缩
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  // loader.setDRACOLoader(dracoLoader);
  const [modelA] = await Promise.all([
    loader.loadAsync('./models/fei.glb'),
  ]);

  const textureLoader = new TextureLoader()
  const [texture, texture1, texture2] = await Promise.all([
    textureLoader.loadAsync('./texture/normal.jpg'),
    textureLoader.loadAsync('./texture/feibg1.png'),
    textureLoader.loadAsync('./texture/feibg2.png'),
  ])
  texture.flipY = false;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(0.5, 0.5);

  const bgMaterial1 = new SpriteMaterial({ map: texture1, color: 0xffffff });
  const spriteBg1 = new Sprite(bgMaterial1);

  const bgMaterial2 = new SpriteMaterial({ map: texture2, color: 0xffffff });
  const spriteBg2 = new Sprite(bgMaterial2);

  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    opacity: 1,
    // wireframe: true,
    blending: AdditiveBlending,
    depthTest: false,
    uniforms: {
      view_vector: { value: camera.position.clone() },
      c: { value: 1.2 },
      p: { value: 1.0 },
      glow_color: { value: new Color(0xffffff) },
      glow_color2: { value: new Color(0xaaeeff) },
      time: { value: 0.0 },
    }
  })

  const feiModel:any = modelA.scene;
  feiModel.material = material;
  feiModel.traverse(function (obj: any) {
    if (obj.isMesh && obj.name!=="ai") {
      //判断是否是网格模型
      obj.material = material;
    }
  });

  const group = new Group()
  group.add(feiModel, spriteBg1, spriteBg2);
  // animation
  feiModel.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
    material.uniforms.time.value += 0.001;
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
