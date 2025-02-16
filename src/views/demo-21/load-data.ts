import {
  Object3D,
  MathUtils,
  Vector3,
  Matrix3
} from "three"
async function loadJSON(url: string) {
  const req = await fetch(url);
  return req.json();
}

async function loadCountryData(label: HTMLDivElement) {
  const countryInfos = await loadJSON('./gis-data/world_country.json');
  const lonFudge = Math.PI * 1.5;
  const latFudge = Math.PI;
  // these helpers will make it easy to position the boxes
  // We can rotate the lon helper on its Y axis to the longitude
  const lonHelper = new Object3D();
  // We rotate the latHelper on its X axis to the latitude
  const latHelper = new Object3D();
  lonHelper.add(latHelper);
  // The position helper moves the object to the edge of the sphere
  const positionHelper = new Object3D();
  positionHelper.position.z = 1;
  latHelper.add(positionHelper);

  for (const countryInfo of countryInfos) {
    const { lat, lon, min, max, name } = countryInfo;
    // adjust the helpers to point to the latitude and longitude
    lonHelper.rotation.y = MathUtils.degToRad(lon) + lonFudge;
    latHelper.rotation.x = MathUtils.degToRad(lat) + latFudge;

    // get the position of the lat/lon
    positionHelper.updateWorldMatrix(true, false);
    const position = new Vector3();
    positionHelper.getWorldPosition(position);
    countryInfo.position = position;

    // compute the area for each country
    const width = max[0] - min[0];
    const height = max[1] - min[1];
    const area = width * height;
    countryInfo.area = area;

    // add an element for each country
    const elem = document.createElement('div');
    elem.textContent = name;
    label.appendChild(elem);
    countryInfo.elem = elem;
  }
  return { countryInfos };
}

const tempV = new Vector3();
const cameraToPoint = new Vector3();
const cameraPosition = new Vector3();
const normalMatrix = new Matrix3();
function updateLabels(countryInfos: any, settings: any, camera: any, container: any) {
  if (!countryInfos) {
    return;
  }
  const large = settings.minArea * settings.minArea;
  normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
  camera.getWorldPosition(cameraPosition);
  for (const countryInfo of countryInfos) {
    const { position, elem, area } = countryInfo;
    if (area < large) {
      elem.style.display = 'none';
      continue;

    }
    tempV.copy(position);
    tempV.applyMatrix3(normalMatrix);
    cameraToPoint.copy(position);
    cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();
    const dot = tempV.dot(cameraToPoint);
    if (dot > settings.maxVisibleDot) {
      elem.style.display = 'none';
      continue;
    }
    elem.style.display = '';
    tempV.copy(position);
    tempV.project(camera);
    const x = (tempV.x * .5 + .5) * container.clientWidth;
    const y = (tempV.y * - .5 + .5) * container.clientHeight;
    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    elem.style.zIndex = (- tempV.z * .5 + .5) * 100000 | 0;
  }
}

export { loadCountryData, updateLabels }
