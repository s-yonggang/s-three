import { Vector3, Object3D } from 'three'

const onDirection = (model: any, camera: any, controls: any, directionalLight: any, skeleton: any) => {
  let vec3Speed = new Vector3();
  let bool = true;
  let isSpace = false
  const keyEvent: any = {
    KeyW: {
      press: false,
      handle: () => {
        vec3Speed.z = -0.04;
        model.rotation.y = Math.PI + controls.getAzimuthalAngle()
      }
    },
    KeyA: {
      press: false,
      handle: () => {
        vec3Speed.x = -0.04;
        model.rotation.y = - Math.PI / 2 + controls.getAzimuthalAngle()
      }
    },
    KeyS: {
      press: false,
      handle: () => {
        vec3Speed.z = 0.04;
        model.rotation.y = Math.PI / 12 + controls.getAzimuthalAngle()
      }
    },
    KeyD: {
      press: false,
      handle: () => {
        vec3Speed.x = 0.04;
        model.rotation.y = Math.PI / 2 + controls.getAzimuthalAngle()
      }
    },
    Space: {
      press: false,
      handle: () => {
        isSpace = true;
      }
    }
  };
  const keyObject: any = {}
  document.addEventListener('keydown', (e) => {
    const key = e.code;
    keyObject[key] = ''
    if (keyEvent[key]) {
      keyEvent[key].press = true;
    }
  }, false);

  document.addEventListener('keyup', (e) => {
    const key = e.code;
    Reflect.deleteProperty(keyObject, key)
    if (keyEvent[key]) {
      keyEvent[key].press = false;
      skeleton(0)
      bool = true;
      isSpace = false
    }
  }, false);

  // 组合键
  function modelDriction() {
    if (Reflect.has(keyObject, 'KeyW') && Reflect.has(keyObject, 'KeyA')) {
      model.rotation.y = Math.PI + (Math.PI / 4 + controls.getAzimuthalAngle())
    }
    if (Reflect.has(keyObject, 'KeyW') && Reflect.has(keyObject, 'KeyD')) {
      model.rotation.y = Math.PI - (Math.PI / 4 - controls.getAzimuthalAngle())
    }
    if (Reflect.has(keyObject, 'KeyS') && Reflect.has(keyObject, 'KeyA')) {
      model.rotation.y = - (Math.PI / 4 - controls.getAzimuthalAngle())
    }
    if (Reflect.has(keyObject, 'KeyS') && Reflect.has(keyObject, 'KeyD')) {
      model.rotation.y = + (Math.PI / 4 + controls.getAzimuthalAngle())
    }
  }
  const keyboardControl = {
    tick: (delta: any) => {
      Object.values(keyEvent).forEach((item: any) => {
        if (item.press) {
          item.handle();
          modelDriction();
          if (bool) {
            const n = isSpace ? skeleton(2) : skeleton(1)
            bool = false
          }
          vec3Speed.applyAxisAngle(Object3D.DEFAULT_UP, controls.getAzimuthalAngle()); // controls angle
          model.position.add(vec3Speed);
          camera.position.add(vec3Speed);
          controls.target.add(vec3Speed);
          directionalLight.target.position.add(vec3Speed); // ^^^ 修改光源位置 ^^^
          directionalLight.position.add(vec3Speed); //
          vec3Speed = new Vector3(0, 0, 0);
        }
      })
    }
  }
  return { keyboardControl }
}

export { onDirection }

