import {
  BoxGeometry,
  Group,
  Mesh,
  DoubleSide,
  MeshPhongMaterial,
  MathUtils,
  GridHelper,
  Color,
  BoxHelper,
  PerspectiveCamera,
  WebGLRenderer
} from "three";
import GUI from "lil-gui";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

async function createModels(camera: PerspectiveCamera, renderer: WebGLRenderer, controls: any) {
  const group = new Group();
  const tControl = new TransformControls(camera, renderer.domElement);
  tControl.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });

  const material = new MeshPhongMaterial({
    side: DoubleSide,
    opacity: 0.2,
    transparent: true,
  });

  // plane geometry material
  const geometry = new BoxGeometry(2, 2, 2);
  const mesh: any = new Mesh(geometry, material);

  tControl.attach(mesh);
  const boxHelper = new BoxHelper(mesh);

  tControl.addEventListener('change', function () {
    boxHelper.update();
    updateGUI();
  });

  window.addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'q':
        tControl.setSpace(tControl.space === 'local' ? 'world' : 'local');
        break;
      case 'Shift':
        tControl.setTranslationSnap(1);
        tControl.setRotationSnap(MathUtils.degToRad(15));
        tControl.setScaleSnap(0.25);
        break;
      case 'w':
        tControl.setMode('translate');
        break;
      case 'e':
        tControl.setMode('rotate');
        break;
      case 'r':
        tControl.setMode('scale');
        break;
      case '+':
      case '=':
        tControl.setSize(tControl.size + 0.1);
        break;
      case '-':
      case '_':
        tControl.setSize(Math.max(tControl.size - 0.1, 0.1));
        break;
      case 'x':
        tControl.showX = !tControl.showX;
        break;
      case 'y':
        tControl.showY = !tControl.showY;
        break;
      case 'z':
        tControl.showZ = !tControl.showZ;
        break;
      case ' ':
        tControl.enabled = !tControl.enabled;
        break;
      case 'Escape':
        tControl.reset();
        break;
      case '1':
        setPresetView(camera, controls, { x: 10, y: 10, z: 10 }, { x: 0, y: 0, z: 0 });
        break;
      case '2':
        setPresetView(camera, controls, { x: -10, y: 10, z: 10 }, { x: 0, y: 0, z: 0 });
        break;
      case '3':
        setPresetView(camera, controls, { x: 0, y: 20, z: 0 }, { x: 0, y: 0, z: 0 });
        break;
    }
  });

  const params = {
    positionX: mesh.position.x,
    positionY: mesh.position.y,
    positionZ: mesh.position.z,
    rotationX: MathUtils.radToDeg(mesh.rotation.x),
    rotationY: MathUtils.radToDeg(mesh.rotation.y),
    rotationZ: MathUtils.radToDeg(mesh.rotation.z),
    scaleX: mesh.scale.x,
    scaleY: mesh.scale.y,
    scaleZ: mesh.scale.z,
    width: geometry.parameters.width,
    height: geometry.parameters.height,
    depth: geometry.parameters.depth,
    translateInit: () => {
      mesh.position.set(0, 0, 0);
      tControl.update(0);
      boxHelper.update();
      updateGUI();
    },
    rotateInit: () => {
      mesh.rotation.set(0, 0, 0);
      tControl.update(0);
      boxHelper.update();
      updateGUI();
    },
    scaleInit: () => {
      mesh.scale.set(1, 1, 1);
      tControl.update(0);
      boxHelper.update();
      updateGUI();
    },
    updateGeometry: () => {
      const newGeometry = new BoxGeometry(params.width, params.height, params.depth);
      mesh.geometry.dispose();
      mesh.geometry = newGeometry;
      boxHelper.update();
      updateGUI();
    }
  };

  const grid = new GridHelper(
    100,
    50,
    new Color(0x999999),
    new Color(0x666666),
  );

  // GUI
  const gui = new GUI();
  const positionFolder = gui.addFolder('Position');
  const rotationFolder = gui.addFolder('Rotation');
  const scaleFolder = gui.addFolder('Scale');
  const sizeFolder = gui.addFolder('Size');

  const positionXController = positionFolder.add(params, 'positionX').name('Position X（m）').onChange((value: number) => { mesh.position.x = optimizeVal(value); boxHelper.update(); });
  const positionYController = positionFolder.add(params, 'positionY').name('Position Y（m）').onChange((value: number) => { mesh.position.y = optimizeVal(value); boxHelper.update(); });
  const positionZController = positionFolder.add(params, 'positionZ').name('Position Z（m）').onChange((value: number) => { mesh.position.z = optimizeVal(value); boxHelper.update(); });
  positionFolder.add(params, 'translateInit').name('平移初始化');

  const rotationXController = rotationFolder.add(params, 'rotationX', -180, 180).name('Rotation X（°）').onChange((value: number) => { mesh.rotation.x = MathUtils.degToRad(optimizeVal(value)); boxHelper.update(); });
  const rotationYController = rotationFolder.add(params, 'rotationY', -180, 180).name('Rotation Y（°）').onChange((value: number) => { mesh.rotation.y = MathUtils.degToRad(optimizeVal(value)); boxHelper.update(); });
  const rotationZController = rotationFolder.add(params, 'rotationZ', -180, 180).name('Rotation Z（°）').onChange((value: number) => { mesh.rotation.z = MathUtils.degToRad(optimizeVal(value)); boxHelper.update(); });
  rotationFolder.add(params, 'rotateInit').name('旋转初始化');

  const scaleXController = scaleFolder.add(params, 'scaleX').name('Scale X（倍数）').onChange((value: number) => { mesh.scale.x = optimizeVal(value); boxHelper.update(); });
  const scaleYController = scaleFolder.add(params, 'scaleY').name('Scale Y（倍数）').onChange((value: number) => { mesh.scale.y = optimizeVal(value); boxHelper.update(); });
  const scaleZController = scaleFolder.add(params, 'scaleZ').name('Scale Z（倍数）').onChange((value: number) => { mesh.scale.z = optimizeVal(value); boxHelper.update(); });
  scaleFolder.add(params, 'scaleInit').name('缩放初始化');

  sizeFolder.add(params, 'width').name('Width（m）').onChange(params.updateGeometry);
  sizeFolder.add(params, 'height').name('Height（m）').onChange(params.updateGeometry);
  sizeFolder.add(params, 'depth').name('Depth（m）').onChange(params.updateGeometry);

  function updateGUI() {
    positionXController.setValue(mesh.position.x);
    positionYController.setValue(mesh.position.y);
    positionZController.setValue(mesh.position.z);
    rotationXController.setValue(MathUtils.radToDeg(mesh.rotation.x));
    rotationYController.setValue(MathUtils.radToDeg(mesh.rotation.y));
    rotationZController.setValue(MathUtils.radToDeg(mesh.rotation.z));
    scaleXController.setValue(mesh.scale.x);
    scaleYController.setValue(mesh.scale.y);
    scaleZController.setValue(mesh.scale.z);
  }

  group.add(mesh, tControl.getHelper(), grid, boxHelper);

  // animation
  mesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
  };

  const onDestroy = () => {
    gui.destroy();
    tControl.dispose();
    geometry.dispose();
    material.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
    group.clear();
    grid.dispose();
    boxHelper.dispose();
  };

  return { group, onDestroy, tControl };
}

function setPresetView(camera: any, controls: any, position: { x: number, y: number, z: number }, target: { x: number, y: number, z: number }) {
  camera.position.set(position.x, position.y, position.z);
  controls.target.set(target.x, target.y, target.z);
  controls.update();
}

function optimizeVal(val: number) {
  return Math.ceil((val * 100)) / 100;
}

export { createModels };
