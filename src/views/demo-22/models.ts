import {
  PlaneGeometry,
  Group,
  Mesh,
  Vector3,
  DoubleSide,
  CubicBezierCurve,
  CubicBezierCurve3,
  Color,
  MeshStandardMaterial,
  Vector2
} from "three";
import { GUI } from "lil-gui"
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
async function createModels(container: any) {
  /**
   * 随机数
   * @param radios 随机数的半径
   * @returns
   */
  function randomNum(radios: number): number {
    const signs = Math.random() > 0.5 ? 1 : -1
    return signs * Math.random() * radios
  }

  /**
   * 生成贝塞尔曲线路径
   */
  function createBezierCurve<T>(arr: T) {
    const curve = new CubicBezierCurve3(...arr as []);
    const points = curve.getPoints(20);
    return points;
  }

  /**
   * 随机路径
   */
  function randomPoints() {
    const points = [
      // new Vector3(2, 0, 0),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      new Vector3(randomNum(2), randomNum(2), randomNum(2)),
      // new Vector3(2, 0, 0)
    ]
    return points
  }

  const lineLeft: any = new MeshLineGeometry()
  const lines: Array<T> = [];
  for (let i = 0; i < 100; i++) {
    const line = lineLeft.clone();
    const curvePoint = createBezierCurve(randomPoints())
    line.setPoints(curvePoint)

    const lineMaterial = new MeshLineMaterial({
      // side: DoubleSide,
      // resolution: new Vector2(container.clientWidth, container.clientHeight),
      color: new Color(0xffffff * Math.random()),
      lineWidth: 0.01,
      dashArray: Math.random() * 0.2,
      dashOffset: 1,
      transparent: true,
      toneMapped: false,
      dashRatio: 0.8,
      depthWrite: false,
    })
    const meshLine = new Mesh(line, lineMaterial);
    meshLine.position.x = randomNum(1)
    meshLine.position.y = randomNum(1)
    meshLine.position.z = randomNum(1)
    lines.push(meshLine)
  }
  // const planeGeometry = new PlaneGeometry(0.2,0.2,1)
  // const material = new MeshStandardMaterial({
  //   color: 0xffffff,
  //   side: DoubleSide
  // })
  // const plane = new Mesh(planeGeometry, material)

  const gui = new GUI();


  const group = new Group()
  group.add(...lines);

  // animation
  group.children[0].tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    for (let i = 0; i < lines.length; i++) {
      lines[i].material.dashOffset = deltaTime * 0.04;
    }
  }

  const onDestroy = () => {
    for (let i = 0; i < lines.length; i++) {
      lines[i].geometry.dispose();
    }
    lineLeft.dispose()
    // lineLeft.geometry.dispose()
    // planeGeometry.dispose()
    // material.dispose()
    gui.destroy()
    // plane.geometry.dispose()
    // plane.material.dispose()
    group.clear();
  }
  return { group, onDestroy };
}

export { createModels }
