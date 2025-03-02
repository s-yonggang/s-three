import { Group, Mesh, BoxGeometry, SphereGeometry, MeshBasicMaterial, ShaderMaterial, Color, AdditiveBlending } from "three";
import { EntityManager, GameEntity, Vector3, SphericalTriggerRegion, RectangularTriggerRegion, Trigger } from 'yuka';
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";


class CustomTrigger extends Trigger {
  constructor(triggerRegion: any) {
    super(triggerRegion);
  }
  execute(entity: any) {
    super.execute(null);
    entity._renderComponent.material.color.set(0x00ff00);
  }

}

function sync(entity: any, renderComponent: any) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

async function createModels() {
  const entityManager = new EntityManager();
  const entity = new GameEntity();
  const entityGeometry = new BoxGeometry(0.5, 0.5, 0.5);
  const entityMaterial = new MeshBasicMaterial({ color: 0xff0000 });
  const entityMesh = new Mesh(entityGeometry, entityMaterial);
  entityMesh.matrixAutoUpdate = false;
  // game entity

  entity.boundingRadius = 0.25;
  entity.setRenderComponent(entityMesh, sync);
  entityManager.add(entity);
  const radius = 2;
  const size = new Vector3(3, 3, 3);
  const sphericalTriggerRegion = new SphericalTriggerRegion(radius);
  const rectangularTriggerRegion = new RectangularTriggerRegion(size);

  const trigger1 = new CustomTrigger(sphericalTriggerRegion);
  trigger1.position.set(3, 0, 0);
  const trigger2 = new CustomTrigger(rectangularTriggerRegion);
  trigger2.position.set(- 3, 0, 0);

  entityManager.add(trigger1);
  entityManager.add(trigger2);


  // test geometry
  const params = {
    uTime: 0.0,
    uStrength: 1.5,
    uColorA: 0x2255ff,
    uColorB: 0xff2255,
  }

  // material
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // side: DoubleSide,
    wireframe: true,
    uniforms: {
      uTime: { value: params.uTime },
      uStrength: { value: params.uStrength },
      uColorA: { value: new Color(params.uColorA) },
      uColorB: { value: new Color(params.uColorB) },
    },
    transparent: true,
    opacity: 0.1, // 设置透明度（0-1）
    depthWrite: false, //
    blending: AdditiveBlending
  })

  const sphereGeometry = new SphereGeometry(radius, 32, 32);
  const sphereMaterial = new MeshBasicMaterial({ color: 0x6083c2, wireframe: true });
  const triggerMesh1 = new Mesh(sphereGeometry, material);
  triggerMesh1.matrixAutoUpdate = false;
  trigger1.setRenderComponent(triggerMesh1, sync);

  const boxGeometry = new BoxGeometry(size.x, size.y, size.z, 10, 10, 10);
  const boxMaterial = new MeshBasicMaterial({ color: 0x6083c2, wireframe: true });
  const triggerMesh2 = new Mesh(boxGeometry, material);
  triggerMesh2.matrixAutoUpdate = false;
  trigger2.setRenderComponent(triggerMesh2, sync);

  // group
  const group = new Group();
  group.add(entityMesh, triggerMesh1, triggerMesh2);

  entityMesh.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
    entity.position.x = Math.sin(deltaTime * 0.5) * 2;
    entity._renderComponent.material.color.set(0xff0000); // reset color
    entityManager.update(delta);
  }
  const onDestroy = () => { }
  return { group, onDestroy };
}

export { createModels }
