import {
  Color,
  DataTexture,
  SRGBColorSpace,
  NearestFilter
} from "three"

import { GPUPickHelper } from "./pick-helper"
let numCountriesSelected = 0;
const tempColor = new Color();
const maxNumCountries = 512;
const paletteTextureWidth = maxNumCountries;
const paletteTextureHeight = 1;
const palette = new Uint8Array(paletteTextureWidth * 4);
const paletteTexture = new DataTexture(palette, paletteTextureWidth, paletteTextureHeight);
paletteTexture.minFilter = NearestFilter;
paletteTexture.magFilter = NearestFilter;
paletteTexture.colorSpace = SRGBColorSpace;

const selectedColor = get255BasedColor('red');
const unselectedColor = get255BasedColor('#444');
const oceanColor = get255BasedColor('rgb(100,200,255)');

function get255BasedColor(color: string | number) {
  tempColor.set(color);
  const base = tempColor.toArray().map(v => v * 255);
  base.push(255); // alpha
  return base;
}

function setPaletteColor(index: number, color: any) {
  palette.set(color, index * 4);
}

function resetPalette() {
  // make all colors the unselected color
  for (let i = 1; i < maxNumCountries; ++i) {
    setPaletteColor(i, unselectedColor);
  }
  // set the ocean color (index #0)
  setPaletteColor(0, oceanColor);
  paletteTexture.needsUpdate = true;
}

const pickHelper = new GPUPickHelper();
const maxClickTimeMs = 200;
const maxMoveDeltaSq = 5 * 5;
const startPosition: any = {};
let startTimeMs: any;

function getCanvasRelativePosition(event: any, canvas: any) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height,
  };
}


function unselectAllCountries(countryInfos: any) {
  numCountriesSelected = 0;
  countryInfos.forEach((countryInfo: any) => {
    countryInfo.selected = false;
  });
  resetPalette();
}

function recordStartTimeAndPosition(event: any, canvas: any) {
  startTimeMs = performance.now();
  const pos = getCanvasRelativePosition(event, canvas);
  startPosition.x = pos.x;
  startPosition.y = pos.y;
}

function pickCountry(event: any, canvas: any, pickingScene: any, camera: any, renderer: any, countryInfos: any) {
  // exit if we have not loaded the data yet
  if(!event){
    unselectAllCountries(countryInfos);
    return;
  }
  let id: number;
  if (!countryInfos) {
    return;
  }
  const clickTimeMs = performance.now() - startTimeMs;
  if (clickTimeMs > maxClickTimeMs) {
    return;
  }
  const position = getCanvasRelativePosition(event, canvas);
  const moveDeltaSq = (startPosition.x - position.x) ** 2 + (startPosition.y - position.y) ** 2;
  if (moveDeltaSq > maxMoveDeltaSq) {
    return;
  }
  id = pickHelper.pick(position, pickingScene, camera, renderer);
  if (id > 0) {
    const countryInfo = countryInfos[id - 1];
    const selected = !countryInfo.selected;
    if (selected && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      unselectAllCountries(countryInfos);
    }
    numCountriesSelected += selected ? 1 : - 1;
    countryInfo.selected = selected;
    setPaletteColor(id, selected ? selectedColor : unselectedColor);
    paletteTexture.needsUpdate = true;

  } else if (numCountriesSelected) {
    unselectAllCountries(countryInfos);
  }
}

export { pickCountry, recordStartTimeAndPosition, setPaletteColor, paletteTexture, paletteTextureWidth }
