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
  MeshNormalMaterial,
  Group
} from "three";
import { createLabelDiv, createLabelLine } from '@/components/WorldLabelRenderer'
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "./terrain_vt.glsl";
import fragmentShader from "./terrain_gm.glsl";

function createTerrain() {

  /**=================================  *terrain*  ================================= */
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

  /**=================================  terrain ================================= */


  /**=================================  fence*  ================================= */
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
    depth: 2.4, //拉伸长度
    bevelEnabled: false, //禁止倒角,
    curveSegments: 100,
  });
  shapeGeo.rotateX(-Math.PI / 2)

  const shapeMaterial = new MeshStandardMaterial({ side: DoubleSide });
  const shapeMesh = new Mesh(shapeGeo, shapeMaterial);
  shapeMesh.position.y = -1;
  // shapeGeo.castShadow = true;
  /**=================================  fence  ================================= */


  /**================================= *label*  ================================= */
  const groupLabel = new Group()
  const lines = createLabelLine(1, '#ffffff');
  const labels = createLabelDiv();
  const data = [
    { position: [-0.18, 1.8, 0.7], text: '天星城' },
    { position: [-0.24, 1.2, 3.75], text: '妙音门' },
    { position: [1.4, 0.8, -4.8], text: '极阴岛' },
    { position: [3.8, 1.2, -4.4], text: '魁星岛' },
    { position: [4.5, 1.2, 2.8], text: '青阳门' },
    { position: [9.2, 0.8, 6], text: '南明岛' },
    { position: [-4.9, 1, 1], text: '南鹤岛' },
    { position: [-6, 0.8, -7.2], text: '落魂岛' },
    { position: [9.7, 0.8, -6.4], text: '古修士遗址' },
    { position: [-11.1, 0.8, 8.5], text: '古传送阵遗址' },
  ]
  for (const item of data) {
    const line: any = lines.clone();
    line.position.set(...item.position);
    groupLabel.add(line.add(labels(item.text)));
  }

  /**=================================  label  ================================= */

  // animation
  const radiansPerSecond = MathUtils.degToRad(10);
  terrain.tick = (delta: any, deltaTime: any) => {
    uniforms.uTime.value = deltaTime;
    // console.log(uniforms.uTime.value)
    // terrain.rotation.x += radiansPerSecond * delta;
    // terrain.rotation.y += radiansPerSecond * delta;
    shapeMesh.rotation.y += radiansPerSecond * delta * 0.2;
    groupLabel.rotation.y += radiansPerSecond * delta * 0.2;
    terrain.rotation.y += radiansPerSecond * delta * 0.2;
  }
  return { terrain, shapeMesh, groupLabel };
}

export { createTerrain }
