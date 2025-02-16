import {
  Object3D,
  MathUtils,
  Vector3
} from "three"
async function loadJSON(url: string) {
  const req = await fetch(url);
  return req.json();
}

async function loadCountryData( label: HTMLDivElement) {
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

export { loadCountryData }
