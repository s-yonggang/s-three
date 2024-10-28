<template>
  <div class="buildingDemo" ref="scanDemoRef"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { ref, onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GraduelBox } from "./graduelBox";

import fragmentShader from "./scan_gm.glsl?raw";
import vertexShader from "./scan_vt.glsl?raw";

const scanDemoRef = ref<HTMLElement | null>(null);

onMounted(() => {
  init();
  console.log('++++++++')
});

function init() {

  const container: any = scanDemoRef.value;
  const width: any = container?.offsetWidth;
  const height: any = container?.offsetHeight;
  let scene: any, camera: any, renderer: any;

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x8cc7de);
  scene.fog = new THREE.Fog(0x8cc7de, 1, 300);

  // const axesHelper = new THREE.AxesHelper(50);
  // scene.add(axesHelper);

  const helper = new THREE.GridHelper(1000, 100);
  helper.position.y = -5;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 2100);
  camera.position.set(60, 780, 60);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, container);
  controls.update();

  controls.minDistance = 300;
  controls.maxDistance = 800;
  controls.maxPolarAngle = Math.PI / 2.2;

  const graduelBox: any = new GraduelBox();
  scene.add(graduelBox.group);

  const shader: any = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      scale: { value: 0 },
      color1: { value: new THREE.Color("#ff00ff") },
      color2: { value: new THREE.Color("#ff00ff") },
    },
  });

  // 面
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), shader);
  plane.rotateX(Math.PI / -2);
  plane.position.y = 10;
  scene.add(plane);

  window.addEventListener("resize", () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    console.log(camera.position)
  });

  function animate() {
    shader.uniforms.scale.value += 0.006;
    shader.uniforms.scale.value %= 1;
    const scale = shader.uniforms.scale.value;
    const far = scale * 250;
    const near = (scale - 0.1) * 250;
    graduelBox.update((box: any) => {
      const distance = box.position.distanceTo(plane.position);
      if (distance > near && distance < far) {
        box.material.uniforms.forceColor = { value: new THREE.Color("#f0f") }
      } else {
        box.material.uniforms.forceColor = { value: new THREE.Color("#20b1df") }
      }
    });
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

</script>

<style scoped>
.buildingDemo {
  width: 100%;
  height: 100%;
}
</style>
