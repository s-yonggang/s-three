import {
  Group,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  PointsMaterial,
  Points,
  BufferGeometry,
  Raycaster,
  Vector2
} from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
  MeshBVHHelper,
  CENTER,
  AVERAGE,
  SAH,

} from 'three-mesh-bvh';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { GUI } from 'lil-gui'
import { max } from "lodash";
// createModels
async function createModels() {
  Mesh.prototype.raycast = acceleratedRaycast;
  BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
  const plyPath = './models/earthquakes.ply';
  const raycaster = new Raycaster();
  const params = {
    displayHelper: true,
    helperDepth: 10,
    displayParents: false,
    maxDepth: 10,
    maxLeafTris: 1,

    strategy: AVERAGE,
    pointSize: 0.2,
    raycastThreshold: 0.005,
    useBVH: true,
  };
  const mouse = new Vector2();
  const loader = new PLYLoader();

  const [pointCloudGeo] = await Promise.all([
    loader.loadAsync(plyPath)
  ])
  pointCloudGeo.center();
  const pointCloudMaterial = new PointsMaterial({ size: params.pointSize, vertexColors: true });
  const pointCloud = new Points(pointCloudGeo, pointCloudMaterial);
  pointCloud.matrixAutoUpdate = false;
  const indices = [];
  const bvhGeometry = pointCloudGeo.clone();
  const verticesLength = bvhGeometry.attributes.position.count;
  for (let i = 0, l = verticesLength; i < l; i++) {
    indices.push(i, i, i);
  }
  bvhGeometry.setIndex(indices);
  const bvhMaterial = new MeshBasicMaterial({ color: 0xff0000 });
  const bvhMesh = new Mesh(bvhGeometry, bvhMaterial);
  bvhMesh.geometry.computeBoundsTree({
    strategy: params.strategy,
    maxDepth: params.maxDepth,      // 增大最大深度限制（默认 40）
    maxLeafTris: params.maxLeafTris    // 减少叶子节点最大三角形数量（默认 10）
  });
  const helper = new MeshBVHHelper(bvhMesh, params.helperDepth);

  const gui = new GUI();
  gui.add(params, 'displayHelper').onChange(() => { helper.visible = params.displayHelper; });
  gui.add(params, 'helperDepth', 0, 20).step(1).onChange((v) => {
    helper.depth = v;
    helper.update()
  });
  gui.add(params, 'pointSize', 0.1, 1.0).onChange(() => { pointCloud.material.size = params.pointSize; });

  // group
  const group = new Group();
  group.add(pointCloud, helper);
  console.log(pointCloud);
  pointCloud.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
  }
  const onDestroy = () => {
    pointCloudMaterial.dispose();
    pointCloudGeo.dispose();
    bvhMaterial.dispose();
    bvhGeometry.dispose();
    // helper.dispose();
    group.remove(pointCloud, helper);
    gui.destroy();
  }
  return { group, onDestroy };
}

export { createModels }
