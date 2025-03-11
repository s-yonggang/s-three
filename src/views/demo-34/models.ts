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
  MeshBasicMaterial,
  Vector3,
  CatmullRomCurve3,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Object3D,
  MeshStandardMaterial,
  PerspectiveCamera,
  TubeGeometry,
  ArrowHelper,
  MathUtils,
  Quaternion,
  Matrix4,
  Color,

} from "three";
import GUI from "lil-gui";
import { Flow, InstancedFlow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { runningPath } from "./running-tracks"
import { extractPathFromGeometry } from "@/libs/utils/extractPathFromGeometry"



async function createModels(camera: PerspectiveCamera) {
  interface ExtendedObject3D extends Object3D {
    tick?: (delta: number, deltaTime: number) => void;
  }
  const loader = new GLTFLoader()
  const [allModel] = await Promise.all([
    loader.loadAsync('./models/roller-coaster.glb')
  ])
  interface ExtendedObject3D extends Object3D {
    tick?: (delta: number, deltaTime: number) => void;
  }
  const model: ExtendedObject3D = allModel.scene;



  const meshPath = model.children[0].children[0].children[0].children[0].children[0] as Mesh;
  meshPath.geometry.applyMatrix4(meshPath.matrixWorld);

  const path = extractPathFromGeometry(meshPath, 200)

  // 轨道线
  const curvePath = new CatmullRomCurve3(path, true);
  // const curvePath = new CatmullRomCurve3(runningPath, true)

  const curvePoints = curvePath.getPoints(1024);
  const line = new BufferGeometry().setFromPoints(curvePoints);
  const curveLine = new Line(line, new MeshBasicMaterial({ color: 0x00ff00 }))

  // tubeGeometry
  const tubeGeometry = new TubeGeometry(curvePath, 1024, 1, 1, true);
  const tubeMaterial = new MeshBasicMaterial({});
  const tubeMesh = new Mesh(tubeGeometry, tubeMaterial);

  // 文字
  const text = '....~@-#*-+` S';
  const fontLoader = new FontLoader();
  const [fontModel] = await Promise.all([
    fontLoader.loadAsync('./font/helvetiker_regular.typeface.json')
  ])
  const textGeometry = new TextGeometry(text, {
    font: fontModel,
    size: 8,
    depth: 1,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.4,
    bevelOffset: 0,
    bevelSegments: 10,
  });
  textGeometry.rotateX(Math.PI / 2);
  const textMaterial = new MeshStandardMaterial({
    color: 0xff0000
  });
  const textMesh = new Mesh(textGeometry, textMaterial); // 创建文字
  // console.log(Flow)
  const flow = new Flow(textMesh); // 文字轨道
  flow.updateCurve(0, curvePath);
  // const arrowHelper = new ArrowHelper(); // 切线辅助线


  // 分组
  const group = new Group();
  group.add(model, flow.object3D, curveLine, tubeMesh);
  // group.add(meshLine);

  const direction = new Vector3();
  const binormal = new Vector3();
  const normal = new Vector3();
  const position = new Vector3();
  const lookAt = new Vector3();

  const axis = new Vector3(0, 0, 1); // 旋转轴
  const angle = MathUtils.degToRad(-90); // 旋转角度转弧度
  // normal.applyAxisAngle(axis, angle);

  const currentQuat = new Quaternion();
  const up = new Vector3(0, 1, 0);

  model.tick = (delta: number, deltaTime: number) => {

    const looptime = 10 * 10;
    const t = (deltaTime % looptime) / looptime;

    // const lookAtPoint = curvePath.getPoint((t + 0.02) % 2);
    // camera.position.copy(curvePath.getPoint(t));
    // camera.position.y = camera.position.y + 1
    // camera.lookAt(lookAtPoint);

    // const curvePoint = curvePath.getPointAt(t);
    // const tangent = curvePath.getTangentAt(t).normalize();
    // // 动态计算修正后的法线
    // const binormal = new Vector3().crossVectors(up, tangent).normalize();
    // const correctedNormal = new Vector3().crossVectors(tangent, binormal).normalize();
    // // 构建目标四元数
    // const rotationMatrix = new Matrix4();
    // rotationMatrix.lookAt(new Vector3(), tangent, correctedNormal);
    // const targetQuat = new Quaternion().setFromRotationMatrix(rotationMatrix);
    // // 平滑插值
    // currentQuat.slerp(targetQuat, 0.1);
    // camera.quaternion.copy(currentQuat);
    // camera.position.copy(curvePoint);

    // textMesh.updateMatrix();
    // curvePath.getPoint(t, position);
    // position.multiplyScalar(1); // 向量乘以标量
    // curvePath.getTangent(t, direction); // 获取当前点的切线方向
    // position.y = position.y + 1 // 相机距离轨道的距离
    // camera.position.copy(position)
    // camera.lookAt(position.clone().add(direction)); // 看向切线方向
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
