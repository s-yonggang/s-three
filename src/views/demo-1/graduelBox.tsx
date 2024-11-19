import * as THREE from 'three';
import vertexShader from './box_vt.glsl';
import fragmentShader from './box_gm.glsl';

export class GraduelBox {
  group = new THREE.Group();
  update: (call: any) => void;

  constructor() {
    const boxShader: any = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        upColor: { value: new THREE.Color('#f00') },
        downColor: { value: new THREE.Color('#000') },
        transColor: { value: new THREE.Color('#fff') },
        timer: { value: 0 },
        speed: { value: 1 },
      },
    });
    const material: any = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const { random } = Math;
    const boxes: any = [] as THREE.ShaderMaterial[];

    for (let i = 0; i < 1000; i++) {
      const height = random() * 20 + 10;
      const itemShader = boxShader.clone();
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(4, height, 4),
        itemShader,
      );

      this.group.add(box);
      boxes.push(box);

      itemShader.uniforms.height = { value: height };
      itemShader.uniforms.upColor.value.b = random();
      itemShader.uniforms.transColor.value.g = random();
      itemShader.uniforms.speed.value = (0.5 - random()) * 200;
      box.position.y = height / 3;
      box.position.x = (0.5 - random()) * 500;
      box.position.z = (0.5 - random()) * 500;
    }
    this.update = (call: any) => {
      boxes.forEach((box: any) => {
        box.material.uniforms.timer.value += 0.02;
        call(box);
      });
    };
  }
}
