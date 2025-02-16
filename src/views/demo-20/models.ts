import {
  Group,
  Mesh,
  TextureLoader,
  SphereGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Vector3,
  Matrix3,
  PerspectiveCamera
} from "three";
import GUI from "lil-gui";
import { loadCountryData } from "./load-data";

async function createModels(container: HTMLDivElement, label: HTMLDivElement, camera: PerspectiveCamera) {
  const textureLoader = new TextureLoader()
  const [texture] = await Promise.all([
    textureLoader.loadAsync('./texture/world_map.png'),
  ])
  const earthGeometry = new SphereGeometry(1, 64, 32);
  const earthMaterial = new MeshPhysicalMaterial({
    map: texture,
    color: 0xf000f0,
    roughness: 0.8,
    metalness: 0.5,
    envMap: texture,
    // side: DoubleSide,
    // blending: AdditiveBlending,
   });
  const earth = new Mesh(earthGeometry, earthMaterial);

  const { countryInfos } = await loadCountryData(label);

  const tempV = new Vector3();
  const cameraToPoint = new Vector3();
  const cameraPosition = new Vector3();
  const normalMatrix = new Matrix3();
  const settings = {
    minArea: 10,
    maxVisibleDot: - 0.2,
  };
  const gui = new GUI();
  gui.add(settings, 'minArea', 0, 50);
  gui.add(settings, 'maxVisibleDot', - 1, 1, 0.01);

  function updateLabels() {
    if (!countryInfos) {
      return;
    }
    const large = settings.minArea * settings.minArea;
    normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
    camera.getWorldPosition(cameraPosition);
    for (const countryInfo of countryInfos) {
			const { position, elem, area } = countryInfo;
			if ( area < large ) {
				elem.style.display = 'none';
				continue;

			}
			tempV.copy( position );
			tempV.applyMatrix3( normalMatrix );
			cameraToPoint.copy( position );
			cameraToPoint.applyMatrix4( camera.matrixWorldInverse ).normalize();
			const dot = tempV.dot( cameraToPoint );
			if ( dot > settings.maxVisibleDot ) {
				elem.style.display = 'none';
				continue;
			}
			elem.style.display = '';
			tempV.copy( position );
			tempV.project( camera );
			const x = ( tempV.x * .5 + .5 ) * container.clientWidth;
			const y = ( tempV.y * - .5 + .5 ) * container.clientHeight;
			elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
			elem.style.zIndex = ( - tempV.z * .5 + .5 ) * 100000 | 0;
    }
  }

  const group = new Group()
  group.add(earth);
  // animation
  earth.tick = (delta: number, deltaTime: any) => {
    // mixer.update(delta * 1);
    // material.uniforms.uTime.value = deltaTime;
    updateLabels()
  }

  const onDestroy = () => {
    gui.destroy();
    texture.dispose();
    earth.geometry.dispose();
    earth.material.dispose();
    group.clear();
   }

  return { group, onDestroy };
}
export { createModels }
