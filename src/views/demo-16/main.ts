
import { Scene, Camera, WebGLRenderer, Vector3, Color,SRGBColorSpace,TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from '@/components/WorldCamera';
import { createScene } from '@/components/WorldScene';
import { createGLRenderer } from '@/components/SystemRenderder';
import { createControls } from '@/components/SystemControls';
import { Resizer } from '@/components/SystemResizer';
import { Loop } from '@/components/SystemLoop';
import { createLights } from "./lights";
import { createModels } from "./models";

let scene: Scene | null;
let camera: Camera | null;
let renderer: WebGLRenderer | null;
let controls: OrbitControls | null | never;
let loop: Loop | null;
let destroyed: () => void;

// const position: Vector3 = new Vector3(2, 2, 2);

class Worlds {
   constructor(container: HTMLDivElement, canvas: HTMLCanvasElement) {
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.postMessage({ type: 'main', canvas: offscreen }, [offscreen]);

    worker.onerror = (err) => {
      console.log(`${err.message} ${err.filename} ${err.lineno}`);
    }

    async function textureLoader(){
      const textureLoader = new TextureLoader()
      const [texture] = await Promise.all([
        textureLoader.loadAsync('./texture/world_map.jpg'),
      ])
      // texture.wrapS = RepeatWrapping;
      // texture.wrapT = RepeatWrapping;
      texture.colorSpace = SRGBColorSpace;
      texture.image.decode().then(() => {
        createImageBitmap(texture.image).then((imageBitmap) => {
          // 将 ImageBitmap 传递给 Worker
          worker.postMessage({ type: 'textureData', imageBitmap }, [imageBitmap]);
        });
      });
    }

    textureLoader();

    function sendSize() {
      worker.postMessage( {
        type: 'size',
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        dpr: window.devicePixelRatio,
      });
      // worker.terminate()
    }
    window.addEventListener( 'resize', sendSize );
    sendSize();

  }
  async init(done: () => void) {
    // const { group, onDestroy } = await createModels();
    done();
    // const { directionalLight, ambientLight } = createLights()
    // scene?.add(group, directionalLight, ambientLight);
    // loop?.updatable.push(controls, group.children[0]);
    // this.start();
    // destroyed = onDestroy;
  }
  render() {
    renderer?.render(scene as Scene, camera as Camera);
  }
  start() {
    loop?.start();
  }
  stoop() {
    loop?.stop();
  }
  destroy() {
    renderer?.setAnimationLoop(null);
    destroyed?.();
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    loop = null;
  }
}

export { Worlds };
