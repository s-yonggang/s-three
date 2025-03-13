import {
  Group,
  IcosahedronGeometry,
  CylinderGeometry,
  MeshStandardMaterial,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh
} from "three";
import GUI from "lil-gui";
import { SUBTRACTION, INTERSECTION, ADDITION, Brush, Evaluator } from 'three-bvh-csg';

async function createModels() {

  const group = new Group()
  const params = {
    operation: SUBTRACTION,
    useGroups: true,
    // wireframe: false,
  };
  const evaluator = new Evaluator();

  const baseBrush = new Brush(
    new IcosahedronGeometry(2, 3),
    new MeshStandardMaterial({
      flatShading: true,

      polygonOffset: true,
      // polygonOffsetUnits: 1,
      // polygonOffsetFactor: 1,
    }),
  );

  const boxGeometry = new BoxGeometry(2, 2, 2);
  const boxMaterial = new MeshPhongMaterial({})
  const boxMesh = new Brush(boxGeometry, boxMaterial)

  const brush = new Brush(
    new CylinderGeometry(0.5, 0.5, 4, 32),
    new MeshStandardMaterial({
      color: 0x80cbc4,

      polygonOffset: true,
      // polygonOffsetUnits: 1,
      // polygonOffsetFactor: 1,

    }),
  );
  const core = new Brush(
    new IcosahedronGeometry(0.15, 1),
    new MeshStandardMaterial({
      flatShading: true,
      color: 0xff9800,
      emissive: 0xff9800,
      emissiveIntensity: 0.35,

      polygonOffset: true,
      // polygonOffsetUnits: 1,
      // polygonOffsetFactor: 1,
    }),
  );

  let result: any;
  function updateCSG() {
    evaluator.useGroups = params.useGroups;
    result = evaluator.evaluate(boxMesh, brush, params.operation, result);
    group.add(result);
  }

  // set up gui
  const gui = new GUI();
  gui.add(params, 'operation', { SUBTRACTION, INTERSECTION, ADDITION });
  // gui.add(params, 'wireframe');
  gui.add(params, 'useGroups');


  group.add(core);
  // animation
  core.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    updateCSG();
  }

  const onDestroy = () => { }

  return { group, onDestroy };
}

export { createModels }
