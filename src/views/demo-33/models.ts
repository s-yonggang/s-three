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
} from "three";
import GUI from "lil-gui";
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { runningPath } from "./running-tracks"

async function createModels(camera: PerspectiveCamera) {

  const loader = new GLTFLoader()
  const [allModel] = await Promise.all([
    loader.loadAsync('./models/roller-coaster.glb')
  ])

  interface ExtendedObject3D extends Object3D {
    tick?: (delta: number, deltaTime: number) => void;
  }
  const model: ExtendedObject3D = allModel.scene;
  // const path = model.children[0].children[0].children[3].children[0].children[0] as Mesh;
  // path.geometry.applyMatrix4(path.matrixWorld)
  // path.visible = false

  const extractedPath: CatmullRomCurve3 = new CatmullRomCurve3(runningPath);
  extractedPath.closed = true;

  // 使用提取的路径
  const catmullRomCurve = extractedPath.getPoints(1024);
  const runningTracks = new Line(
    new BufferGeometry().setFromPoints(catmullRomCurve),
    new LineBasicMaterial({ color: 0x00ff00 })
  );

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
  const flow = new Flow(textMesh); // 文字轨道
  flow.updateCurve(0, extractedPath);

  const group = new Group()
  group.add(model, flow.object3D, runningTracks);

  // animation

  const params = {
    scale: 1,
    lookAhead: true,
    first: false,
    free: true
  }
  const direction = new Vector3();
  const position = new Vector3();
  // extractedPath.getPointAt(position)

  const gui = new GUI();
  gui.add(params, 'first').onChange((val: boolean) => {
    params.first = val;
    flow.object3D.visible = !val;
    if (val) {
      params.free = true;
    }
  });

  model.tick = (delta: number, deltaTime: any) => {
    // camera.position.lerp(new Vector3(-300, 300, 300), 0.01);
    const looptime = 10 * 10;
    const t = (deltaTime % looptime) / looptime;
    if (params.first) {
      textMesh.updateMatrix();
      extractedPath.getPoint(t, position);
      position.multiplyScalar(params.scale); // 向量乘以标量
      extractedPath.getTangent(t, direction); // 获取当前点的切线方向

      position.y = position.y + 2 // 相机距离轨道的距离
      camera.position.copy(position)
      camera.lookAt(position.clone().add(direction))
    }
    if (!params.first && params.free) {
      camera.position.lerp(new Vector3(300, 300, 300), 0.1);
      if (camera.position.x > 298) {
        params.free = false;
      }
    } else {
      flow.moveAlongCurve(delta * 0.02);
    }
  }

  const onDestroy = () => {
    gui.destroy();
    textGeometry.dispose();
    textMaterial.dispose();
    runningTracks.geometry.dispose();
    runningTracks.material.dispose();
    model.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    group.clear()
  }

  return { group, onDestroy };
}

export { createModels }
