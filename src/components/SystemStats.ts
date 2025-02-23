import Stats from 'three/examples/jsm/libs/stats.module.js';

class createStats extends Stats {
  stats: Stats
  domElement: HTMLElement
  tick: () => void
  constructor(domElement: HTMLElement) {
    super();
    this.stats = new Stats();
    this.domElement = domElement;
    this.tick = ()=>{
      this.update();
    }
  }
  init(domElement: HTMLElement) {
    this.stats.showPanel(0);
    domElement.appendChild(this.stats.dom);
  }
  update() {
    this.stats.update();
  }
  destroy() {
    this.domElement.removeChild(this.stats.dom);
    this.stats = null as any;
    this.domElement = null as any;
    this.tick = null as any;
    this.update = null as any;
  }
}

export {
  createStats,
}
