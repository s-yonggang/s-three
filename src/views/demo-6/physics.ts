import { World, Body, Vec3, Box } from 'cannon-es'
import { Box3, Vector3, } from 'three'
function createPhysicsWorld(mesh: any) {
  //
  const world = new World()
  world.gravity.set(0, -9.82, 0);

  const box3 = new Box3();
  box3.expandByObject(mesh);//计算模型包围盒
  const size = new Vector3();
  box3.getSize(size);//包围盒计算箱子的尺寸

  const body = new Body({
    shape: new Box(new Vec3(size.x / 2, size.y / 2, size.z / 2))
  });
  return body
}

export { createPhysicsWorld }
