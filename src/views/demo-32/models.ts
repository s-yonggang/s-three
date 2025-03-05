import {
  Group,
  PlaneGeometry,
  Plane,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  ZeroStencilOp,
  NotEqualStencilFunc,
  BufferGeometry,
  BufferAttribute,
  DynamicDrawUsage,
  LineBasicMaterial,
  LineSegments,
  MeshStandardMaterial,
  EqualDepth,
  IncrementWrapStencilOp,
  FrontSide,
  BackSide,
  DecrementWrapStencilOp,
  Box3,
  Vector3,
  Line3,
  Matrix4
} from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHHelper, CONTAINED } from 'three-mesh-bvh';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from "lil-gui";
async function createModels() {
  const params = {
    useBVH: true,
    helperDisplay: false,
    helperDepth: 10,
    wireframeDisplay: !false,
    displayModel: true,
    animate: true,
    animation: 'SPI',
    invert: false,
  };

  let initialClip = false;

  // 剪裁平面
  const clippingPlanes = [new Plane()];
  const planeMesh = new Mesh(new PlaneGeometry(), new MeshBasicMaterial({
    side: DoubleSide,
    stencilWrite: true,
    stencilFunc: NotEqualStencilFunc,
    stencilFail: ZeroStencilOp,
    stencilZFail: ZeroStencilOp,
    stencilZPass: ZeroStencilOp,
  }));
  planeMesh.scale.setScalar(2.5);
  planeMesh.material.color.set(0x80deea);
  planeMesh.renderOrder = 2;
  planeMesh.visible = false


  // 创建具有足够数据以容纳 100000 个段的线几何体
  const lineGeometry = new BufferGeometry();
  const linePosAttr = new BufferAttribute(new Float32Array(300000), 3, false);
  linePosAttr.setUsage(DynamicDrawUsage);
  lineGeometry.setAttribute('position', linePosAttr);
  const outlineLines = new LineSegments(lineGeometry, new LineBasicMaterial({ color: 0xff0000 }));
  // outlineLines.material.color.set(0xff0000);
  // outlineLines.frustumCulled = false;
  outlineLines.renderOrder = 3;


  // gltf-格式-模型压缩
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  const [A] = await Promise.all([
    loader.loadAsync('./models/gears.glb'),
  ]);

  // 将模型合并处理
  const geometries: any = [];
  A.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.updateMatrixWorld = true;
      const geometry = child.geometry.clone();
      geometry.applyMatrix4(child.matrixWorld)
      geometries.push(geometry);
    }
  });

  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);;
    // 使用基本材质，因为使用剪裁帽很昂贵，因为片段着色器必须始终运行。
  const model = new Mesh(mergedGeometry, new MeshStandardMaterial({}))
  model.material = new MeshStandardMaterial({});
  model.position.set(0, 0, 0);
  model.quaternion.identity();

  // 使用 EQUAL 深度为几何体的表面着色，以限制必须运行的片段着色数量。
  const surfaceModel = model.clone();
  surfaceModel.material = new MeshStandardMaterial({
    depthFunc: EqualDepth,
  });
  surfaceModel.renderOrder = 1;
  outlineLines.scale.copy(model.scale);
  outlineLines.position.set(0, 0, 0);
  outlineLines.quaternion.identity();
  model.updateMatrixWorld(true);

  // 调整所有材质以使用剪裁帽绘制正面和背面
  const matSet = new Set();
  const materialMap = new Map();
  const frontSideModel = model;
  frontSideModel.updateMatrixWorld(true);

  frontSideModel.traverse((c: any) => {
    if (c.isMesh) {
      if (materialMap.has(c.material)) {
        c.material = materialMap.get(c.material);
        return;
      }
      matSet.add(c.material);
      const material = c.material.clone();
      material.color.set(0xff0000);
      material.roughness = 1.0;
      material.metalness = 0.0;
      material.side = FrontSide;
      material.stencilWrite = true;
      material.stencilFail = IncrementWrapStencilOp;
      material.stencilZFail = IncrementWrapStencilOp;
      material.stencilZPass = IncrementWrapStencilOp;
      material.clippingPlanes = clippingPlanes;
      materialMap.set(c.material, material);
      c.material = material;
    }
  });
  materialMap.clear();
  const backSideModel = frontSideModel.clone();
  backSideModel.traverse((c: any) => {
    if (c.isMesh) {
      if (materialMap.has(c.material)) {
        c.material = materialMap.get(c.material);
        return;
      }
      const material = c.material.clone();
      material.color.set(0xffffff);
      material.roughness = 1.0;
      material.metalness = 0.0;
      material.colorWrite = false;
      material.depthWrite = false;
      material.side = BackSide;
      material.stencilWrite = true;
      material.stencilFail = DecrementWrapStencilOp;
      material.stencilZFail = DecrementWrapStencilOp;
      material.stencilZPass = DecrementWrapStencilOp;
      material.clippingPlanes = clippingPlanes;
      materialMap.set(c.material, material);
      c.material = material;
    }
  });
  // 创建碰撞器和预览网格
  const colliderBvh = new MeshBVH(mergedGeometry, { maxLeafTris: 3 });
  mergedGeometry.boundsTree = colliderBvh;
  const colliderMesh = new Mesh(mergedGeometry, new MeshBasicMaterial({
    // wireframe: true,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  }));
  colliderMesh.renderOrder = 2;
  colliderMesh.position.copy(model.position);
  colliderMesh.rotation.copy(model.rotation);
  colliderMesh.scale.copy(model.scale);
  let bvhHelper:any = new MeshBVHHelper(colliderMesh, params.helperDepth);
  bvhHelper.depth = params.helperDepth;
  bvhHelper.update();
  bvhHelper.visible = false;

  const group = new Group();

  group.add(planeMesh, model, frontSideModel, backSideModel, surfaceModel, colliderMesh, bvhHelper, outlineLines)

  const box = new Box3();
  box.setFromObject(frontSideModel);
  box.getCenter(group.position).multiplyScalar(- 1);
  group.updateMatrixWorld(true);

  const tempVector = new Vector3();
  const tempVector1 = new Vector3();
  const tempVector2 = new Vector3();
  const tempVector3 = new Vector3();
  const tempLine = new Line3();
  const inverseMatrix = new Matrix4();
  const localPlane = new Plane();
  // 动画
  planeMesh.tick = (delta: number, deltaTime: any) => {
    if (bvhHelper) {
      bvhHelper.visible = params.helperDisplay;
      colliderMesh.visible = params.wireframeDisplay;
      frontSideModel.visible = params.displayModel;
      backSideModel.visible = params.displayModel;
    }

    outlineLines.material.color.set(params.displayModel ? 0xff0000 : 0x4dd0e1).convertSRGBToLinear();
    planeMesh.position.set(Math.sin(0.25 * deltaTime * 2) * 0.325 * 10, 0, 0);
    planeMesh.rotation.set(0, Math.PI / 2, 0);
    planeMesh.updateMatrixWorld();

    const clippingPlane = clippingPlanes[0];
    clippingPlane.normal.set(0, 0, params.invert ? 1 : - 1);
    clippingPlane.constant = 0;
    clippingPlane.applyMatrix4(planeMesh.matrixWorld);


    if (colliderBvh && (params.animate || !initialClip)) {
      initialClip = true;
      // 获取 BVH 局部空间中的剪裁平面
      inverseMatrix.copy(colliderMesh.matrixWorld).invert();
      localPlane.copy(clippingPlane).applyMatrix4(inverseMatrix);

      let index = 0;
      const posAttr = outlineLines.geometry.attributes.position;
      colliderBvh.shapecast({
        intersectsBounds: box => {
          // 如果我们不使用 BVH，则直接跳到迭代所有三角形
          if (!params.useBVH) {
            return CONTAINED;
          }
          return localPlane.intersectsBox(box);
        },

        intersectsTriangle: tri => {
          // 检查每个三角形边缘是否与平面相交。如果是，则将其添加到段列表中。
          let count = 0;
          tempLine.start.copy(tri.a);
          tempLine.end.copy(tri.b);
          if (localPlane.intersectLine(tempLine, tempVector)) {
            posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
            index++;
            count++;
          }

          tempLine.start.copy(tri.b);
          tempLine.end.copy(tri.c);
          if (localPlane.intersectLine(tempLine, tempVector)) {
            posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
            count++;
            index++;
          }

          tempLine.start.copy(tri.c);
          tempLine.end.copy(tri.a);
          if (localPlane.intersectLine(tempLine, tempVector)) {
            posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
            count++;
            index++;
          }

          // 当平面穿过顶点和三角形的一个边时，会有三个交点，其中两个必须重复
          if (count === 3) {
            tempVector1.fromBufferAttribute(posAttr, index - 3);
            tempVector2.fromBufferAttribute(posAttr, index - 2);
            tempVector3.fromBufferAttribute(posAttr, index - 1);
            // 如果最后一个点是重复的交点
            if (tempVector3.equals(tempVector1) || tempVector3.equals(tempVector2)) {
              count--;
              index--;
            } else if (tempVector1.equals(tempVector2)) {
              // 如果最后一个点不是重复的交点
              // 将倒数第二个点设置为不同的点并删除最后一个点
              posAttr.setXYZ(index - 2, tempVector3);
              count--;
              index--;
            }
          }

          // 如果我们只与一个或三个边相交，则将其删除。这可以更优雅地处理。
          if (count !== 2) {
            index -= count;
          }

        },

      });

      // 将绘制范围设置为仅新段并偏移线条以使其不与几何体相交
      outlineLines.geometry.setDrawRange(0, index);
      outlineLines.position.copy(clippingPlane.normal).multiplyScalar(- 0.00001);
      posAttr.needsUpdate = true;

      // const delta = window.performance.now() - startTime;
      // outputElement.innerText = `${ parseFloat( delta.toFixed( 3 ) ) }ms`;

    }

  }
  const onDestroy = () => {
    // Dispose geometries
    mergedGeometry.dispose();
    lineGeometry.dispose();
    planeMesh.geometry.dispose();
    planeMesh.material.dispose();
    outlineLines.geometry.dispose();
    outlineLines.material.dispose();
    colliderMesh.geometry.dispose();
    colliderMesh.material.dispose();

    // Dispose materials
    model.material.dispose();
    surfaceModel.material.dispose();
    frontSideModel.traverse((c: any) => {
      if (c.isMesh) {
        c.material.dispose();
      }
    });
    backSideModel.traverse((c: any) => {
      if (c.isMesh) {
        c.material.dispose();
      }
    });

    // Dispose BVH helper
    bvhHelper = null;


    // Dispose loaders
    dracoLoader.dispose();
  }
  return { group, onDestroy };
}

export { createModels }
