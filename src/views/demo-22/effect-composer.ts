import { Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GUI } from "lil-gui"

const params = {
  threshold: 0,
  strength: 1,
  radius: 0,
  exposure: 1
};

class BloomComposer {
  composer: EffectComposer
  bloomPass: UnrealBloomPass
  renderPass: RenderPass
  outputPass: OutputPass
  setSize: () => void
  tick: () => void

  constructor(container: any, renderer: any, scene: any, camera: any) {
    this.bloomPass = new UnrealBloomPass(
      new Vector2(container.clientWidth, container.clientHeight),
      0,
      0.0,
      0.0
    );
    this.bloomPass.threshold = params.threshold;
    this.bloomPass.strength = params.strength;
    this.bloomPass.radius = params.radius;
    this.renderPass = new RenderPass(scene, camera);
    this.outputPass = new OutputPass();
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.outputPass);

    // this.composer.addPass(this.renderPass);
    this.setSize = () => this.composer.setSize.bind(null, container.clientWidth, container.clientHeight);
    this.tick = () => {
      this.composer.render()
    };

    const gui = new GUI();

    const bloomFolder = gui.addFolder('bloom');

    bloomFolder.add(params, 'threshold', 0.0, 1.0).onChange((value) => {
      this.bloomPass.threshold = Number(value);
    });

    bloomFolder.add(params, 'strength', 0.0, 3.0).onChange((value) => {
      this.bloomPass.strength = Number(value);
    });

    gui.add(params, 'radius', -10.0, 1.0).step(0.01).onChange((value) => {
      this.bloomPass.radius = Number(value);
    });

    const toneMappingFolder = gui.addFolder('tone mapping');
    toneMappingFolder.add(params, 'exposure', 0.1, 2).onChange((value) => {
      renderer.toneMappingExposure = Math.pow(value, 4.0);
    });
  }
  size() {
    this.setSize();
  }
  render() {
    this.composer.render();
  }
  dispose() {
    this.composer.dispose();
    this.gui.destroy();
    this.bloomPass.dispose();
    this.setSize = null as any;
    this.tick = null as any;
    this.gui = null as any;
    this.composer = null as any;
  }
}

export { BloomComposer }
