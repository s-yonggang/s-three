import {
  AnimationMixer,
  Points,
  Color,
  Group
} from "three";
import { uniform, skinning } from 'three/tsl';
import { PointsNodeMaterial } from 'three/webgpu';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function createModels() {
  // gltf-格式-模型加载
  const loader = new GLTFLoader();
  const [modelA] = await Promise.all([
    loader.loadAsync('./models/Michelle.glb'),
    // loader.loadAsync('./models/jfjh.glb'),
  ]);

  const model: any = modelA.scene;
  // const model: any = modelA.scene.children[0];
  const groupPoint: any = new Group()
  model.traverse(function (child: any) {
    if (child.isMesh) {
      // child.visible = false;
      const materialPoints = new PointsNodeMaterial();
      materialPoints.colorNode = uniform(new Color());
      materialPoints.positionNode = skinning(child);
      const modelPoint = new Points(child.geometry, materialPoints);
      modelPoint.rotateZ(-Math.PI / 2);
      modelPoint.rotateY(Math.PI / 2);
      modelPoint.position.set(0, -80, 0);
      groupPoint.add(modelPoint);
    }
  });

  const clip = modelA.animations[0];
  const mixer = new AnimationMixer(model);
  const action: any = mixer.clipAction(clip);
  action.play();
  model.tick = (delta: number) => {
    mixer.update(delta * 1);
  }

  return { model, groupPoint };
}

export { createModels }
