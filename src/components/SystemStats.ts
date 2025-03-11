import Stats from 'three/examples/jsm/libs/stats.module.js';

class createStats {
  stats: Stats
  domElement: HTMLElement
  tick: () => void
  constructor(domElement: HTMLElement) {
    // super();
    this.stats = new Stats();
    this.domElement = domElement;
    this.tick = ()=>{
      this.update();
    }
    this.init();
  }
  init() {
    this.stats.showPanel(0);
    this.domElement.appendChild(this.stats.dom);
  }
  update() {
    this.stats.update();
  }
  begin(){
    this.stats.begin();
  }
  end(){
    this.stats.end();
  }
  destroy() {
    this.domElement.removeChild(this.stats.dom);
    this.stats.end();
    this.stats = null as any;
    this.domElement = null as any;
    this.tick = null as any;
    this.update = null as any;
  }
}

export {
  createStats,
}
