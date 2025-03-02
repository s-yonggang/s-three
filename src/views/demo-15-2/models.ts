import {
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Color,
  SRGBColorSpace,
  VideoTexture,
  NearestFilter,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  AdditiveBlending,
  Points,
} from "three";
// import GUI from "lil-gui";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
async function createModels(rtcVideo: any) {
  const videoTexture = new VideoTexture(rtcVideo);
  // videoTexture.colorSpace = SRGBColorSpace;
  videoTexture.minFilter = NearestFilter;
  videoTexture.generateMipmaps = false;
  const width = 640, height = 480;
  const nearClipping = 850, farClipping = 4000;
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(width * height * 3);

  for (let i = 0, j = 0, n = vertices.length; i < n; i += 3, j++) {
    vertices[i] = j % width;
    vertices[i + 1] = Math.floor(j / width);
  }
  geometry.setAttribute('position', new BufferAttribute(vertices, 3));
  const material = new ShaderMaterial( {
    uniforms: {
      'map': { value: videoTexture },
      'width': { value: width },
      'height': { value: height },
      'nearClipping': { value: nearClipping },
      'farClipping': { value: farClipping },
      'pointSize': { value: 2 },
      'zOffset': { value: 1000 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    blending: AdditiveBlending,
    depthTest: false, depthWrite: false,
    transparent: true
  } );
  const mesh = new Points( geometry, material );
  const group = new Group()
  group.add(mesh);


  const onDestroy = () => {
    videoTexture.dispose();
    material.dispose();
    geometry.dispose();
    group.remove(mesh);
   }

  return { group, onDestroy };
}

export { createModels }
