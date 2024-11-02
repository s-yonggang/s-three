import {
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  MeshDepthMaterial,
  Mesh,
  MathUtils,
  Uniform,
  Color,
  RGBADepthPacking,
  Path,
  Shape,
  ExtrudeGeometry,
  DoubleSide,
  MeshNormalMaterial
} from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "./terrain_vt.glsl?raw";
import fragmentShader from "./terrain_gm.glsl?raw";

function createTerrain() {

  const uniforms = {
    uTime: new Uniform(0.2),
    uPositionFrequency: new Uniform(0.2),
    uStrength: new Uniform(4.0),
    uWrapFrequency: new Uniform(2.0),
    uWrapStrength: new Uniform(0.2)
  }

  // material
  const material = new CustomShaderMaterial({
    baseMaterial: MeshStandardMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    metalness: 0.5,
    roughness: 1.0,
  })
  const depthMaterial = new CustomShaderMaterial({
    baseMaterial: MeshDepthMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    depthPacking: RGBADepthPacking
  })

  // geometry
  const geometry = new PlaneGeometry(30, 30, 600, 600);
  geometry.rotateX(-Math.PI / 2)
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')

  const terrain: any = new Mesh(geometry, material);
  terrain.customDepthMaterial = depthMaterial;
  terrain.castShadow = true;
  terrain.receiveShadow = true;


  // fans
  const shape = new Shape();
  shape.moveTo(15.4, 15.4);
  shape.lineTo(15.4, -15.4);
  shape.lineTo(-15.4, -15.4);
  shape.lineTo(-15.4, 15.4);
  shape.closePath();

  const path = new Path();
  path.moveTo(15, 15)
  path.lineTo(15, -15)
  path.lineTo(-15, -15)
  path.lineTo(-15, 15)
  path.closePath();
  shape.holes.push(path);
  const shapeGeo = new ExtrudeGeometry(shape, {
    depth: 2, //拉伸长度
    bevelEnabled: false, //禁止倒角,
    curveSegments: 100,
  });
  shapeGeo.rotateX(-Math.PI / 2)

  const shapeMaterial = new MeshStandardMaterial({ side: DoubleSide });
  const shapeMesh = new Mesh(shapeGeo, shapeMaterial);
  shapeMesh.position.y = -1;
  shapeGeo.castShadow = true;

  // animation
  // const radiansPerSecond = MathUtils.degToRad(10);
  terrain.tick = (delta: any, deltaTime: any) => {
    uniforms.uTime.value = deltaTime;
    // console.log(uniforms.uTime.value)
    // terrain.rotation.x += radiansPerSecond * delta;
    // terrain.rotation.y += radiansPerSecond * delta;
    // terrain.rotation.z += radiansPerSecond * delta;
  }
  return { terrain, shapeMesh };
}

export { createTerrain }
