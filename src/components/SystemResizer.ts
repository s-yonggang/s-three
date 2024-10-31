const setSize = (container: any, camera: any, renderer: any): void => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  console.log(camera.position)
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container: any, camera: any, renderer: any) {
    setSize(container, camera, renderer);
    window.addEventListener('resize', () => {
      setSize(container, camera, renderer);
      this.onResize();
    });
  }
  onResize() { }
}

export { Resizer };
