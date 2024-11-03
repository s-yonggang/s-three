function setSize(container: any, camera: any, renderer: any, labelRenderer: any = null) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  if (labelRenderer) {
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
  }
  console.log(camera.position)
};

class Resizer {
  constructor(container: any, camera: any, renderer: any, labelRenderer: any) {
    setSize(container, camera, renderer, labelRenderer);
    window.addEventListener('resize', () => {
      setSize(container, camera, renderer, labelRenderer);
      this.onResize();
    });
  }
  onResize() { }
}

export { Resizer };
