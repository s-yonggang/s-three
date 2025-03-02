import {
  Group,
  Mesh,
  BoxGeometry,
  SphereGeometry,
  MeshBasicMaterial,
} from "three";
import { EntityManager, Time, GameEntity, Vector3, SphericalTriggerRegion, RectangularTriggerRegion, Trigger } from 'yuka';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

class CustomTrigger extends Trigger {
  constructor(triggerRegion: any) {
    super(triggerRegion);
  }
  execute(entity: any) {
    super.execute(null);
    entity._renderComponent.material.color.set(0xff00ff);
  }
}

function sync(entity: any, renderComponent: any) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

// createModels
async function createModels(camera: any, renderer: any, controls: any) {
  const radius = 2;
  const sphericalTriggerRegion = new SphericalTriggerRegion(radius);

  const entity = new GameEntity();
  const entityManager = new EntityManager();


  // entityGeometry
  const entityGeometry = new BoxGeometry(0.5, 0.5, 0.5);
  const entityMaterial = new MeshBasicMaterial({ color: 0xff0000 });
  const entityMesh = new Mesh(entityGeometry, entityMaterial);
  // entityMesh.matrixAutoUpdate = false;
  entityMesh.position.set(0, 0, 3);

  entity.boundingRadius = 0;
  entity.setRenderComponent(entityMesh, sync);
  entityManager.add(entity);

  const trigger = new CustomTrigger(sphericalTriggerRegion);
  trigger.position.set(0, 0, 0);
  entityManager.add(trigger);

  // dragBox
  const dragGeometry = new SphereGeometry(radius, 16, 16);
  const dragMaterial = new MeshBasicMaterial({
    color: 0x6083c2,
    opacity: 0.5,
    transparent: true,
    // wireframe: true
  });
  const dragBox = new Mesh(dragGeometry, dragMaterial);
  // dragBox.matrixAutoUpdate = false;
  trigger.setRenderComponent(dragBox, sync);
  const dragBoxControl = new TransformControls(camera, renderer.domElement);


  dragBoxControl.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
    dragBox.updateMatrix();
    entityMesh.updateMatrix();
  });
  dragBoxControl.attach(dragBox);
  dragBoxControl.size = 0.5;

  // group
  const group = new Group();
  group.add(dragBox, dragBoxControl.getHelper(), entityMesh);

  dragBox.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;

    entityManager.update(delta);
    entity._renderComponent.material.color.set(0xff0000); // reset color
    // console.log('+++');
  }
  const onDestroy = () => {
    entityManager.clear();

    dragBoxControl.detach();
    dragBoxControl.dispose();
    dragBox.geometry.dispose();
    dragBox.material.dispose();
    entityGeometry.dispose();
    entityMaterial.dispose();

    entityMesh.geometry.dispose();
    entityMesh.material.dispose();

  }
  return { group, onDestroy };
}
export { createModels }
