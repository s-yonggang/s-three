
import {
  // SphereGeometry,
  ConeGeometry,
  OctahedronGeometry,
  BoxGeometry,
  TorusGeometry,
  MathUtils,
  IcosahedronGeometry,
  Mesh,
  Uniform,
  DoubleSide,
  PlaneGeometry,
  MeshStandardMaterial,     // 一种基于物理的标准材质，基于物理的渲染（PBR）最近已成为许多3D应用程序的标准，例如Unity， Unreal和 3D Studio Max。
  MeshDepthMaterial,        // 深度基于相机远近平面。白色最近，黑色最远。
  MeshDistanceMaterial,     // 在内部用于使用PointLight来实现阴影映射
  MeshLambertMaterial,      // 一种非光泽表面的材质，没有镜面高光。基于非物理的Lambertian模型来计算反射率。
  MeshMatcapMaterial,       // 由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义。
  MeshNormalMaterial,       // 一种把法向量映射到RGB颜色的材质。
  MeshPhongMaterial,        // Blinn-Phong模型来计算反射率。
  MeshPhysicalMaterial,     // 提供了更高级的基于物理的渲染属性：
  MeshToonMaterial,         // 一种实现卡通着色的材质。
  PointsMaterial,           // Points使用的默认材质。
  RawShaderMaterial,        // 内置的uniforms和attributes的定义不会自动添加到GLSL shader代码中。
  RGBADepthPacking,
  MeshBasicMaterial,        // 基础网格材质，不受光照的影响。
  ShaderMaterial,           // 使用自定义shader渲染的材质。shader是一个用GLSL编写的小程序 ，在GPU上运行。 您可能需要使用自定义shader
  ShadowMaterial,           // 此材质可以接收阴影，但在其他方面完全透明。
  SpriteMaterial            // 一种使用Sprite的材质。贴图
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "./cube_vt.glsl";
import fragmentShader from "./cube_gm.glsl";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
async function createCube() {
  // const gui = new GUI({ width: 300 });


  const uniforms = {
    uTime: new Uniform(0.0),
    uPositionFrequency: new Uniform(0.6),
    uTimeFrequency: new Uniform(0.6),
    uStrength: new Uniform(0.5)
  }

  const material: any = new CustomShaderMaterial({
    // CSM
    baseMaterial: MeshPhysicalMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    // silent: true,
    // MeshPhysicalMaterial
    metalness: -2.0,
    roughness: 0.8,
    // color: 0xff00ff,
    transmission: 0,
    ior: 0.0,
    thickness: 0.0,
    // transparent: true,
    // wireframe: true,
  });

  const depthMaterial: any = new CustomShaderMaterial({
    // CSM
    baseMaterial: MeshDepthMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,

    // MeshDepthMaterial
    depthPacking: RGBADepthPacking,

  });

  // geometry
  let geometry: any = new IcosahedronGeometry(10, 50)
  geometry = mergeVertices(geometry);
  geometry.computeTangents();// 这是什么？

  // mesh
  const sphere: any = new Mesh(geometry, material)
  sphere.customDepthMaterial = depthMaterial;  // customDepthMaterial 一直写错烦死了/(ㄒoㄒ)/~~  目的是为了形变阴影
  sphere.receiveShadow = true;
  sphere.castShadow = true;


  const planeGeometry = new PlaneGeometry(50, 50);
  const planeMaterial = new MeshStandardMaterial({ color: 0xf1f1f1f1 });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / -2; // 绕x轴旋转45度（注意正反面）
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.position.y = -15;

  const radiansPerSecond = MathUtils.degToRad(10);
  sphere.tick = (delta: any, deltaTime: any) => {
    // increase the cube's rotation each frame
    uniforms.uTime.value = deltaTime;
    sphere.rotation.z += delta * radiansPerSecond;
    sphere.rotation.x -= delta * radiansPerSecond;
    sphere.rotation.y += delta * radiansPerSecond;
  };

  const onDestroy = () => { };
  const objects = await { sphere, plane, onDestroy };
  console.log('----')
  return objects;
}
export { createCube }
