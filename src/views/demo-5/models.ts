import {
  Group,
  Vector3,
  QuadraticBezierCurve3
} from "three";
// import { createLabelDiv, createLabelLine } from '@/components/WorldLabelRenderer'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import url from "@/assets/images/sprite.png";
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
import { createFlyLine, createLightPoint } from "./createflying";

function createModels() {

  // 初始化飞线和光点
  const startPoint = new Vector3(-20, 0, 0);
  const endPoint = new Vector3(20, 0, 0);
  const flyLine = createFlyLine(startPoint, endPoint);
  const lightPoint = createLightPoint();

  // 动画参数
  let time = 0;
  const speed = 0.002;
  const curve = new QuadraticBezierCurve3(
    startPoint,
    new Vector3(0, 10, 0),
    endPoint
  );

  function update() {
    time = (time + speed) % 1;
    const point = curve.getPointAt(time);
    lightPoint.position.copy(point);

    const alpha = Math.abs(Math.sin(time * Math.PI));
    flyLine.material.opacity = alpha;
    flyLine.material.transparent = true;
    flyLine.material.needsUpdate = true;
  }
  const group = new Group();
  group.add(lightPoint);

  lightPoint.tick = (delta: number, deltaTime: any) => {
    update();
  }

  const onDestroy = () => {
    flyLine.geometry.dispose();
    flyLine.material.dispose();
    lightPoint.geometry.dispose();
    lightPoint.material.dispose();
    group.remove(lightPoint, flyLine);
    group.clear();
    time = 0;
  }

  return { group, onDestroy };
}

export { createModels }
