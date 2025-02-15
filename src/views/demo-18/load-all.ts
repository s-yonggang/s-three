
import { MeshBasicMaterial, Mesh } from "three"
import { parseData } from "./parseDate";
import { makeBoxes } from "./makeBoxes";
async function loadFile(url: any) {
  const req = await fetch(url);
  return req.text();

}

async function loadData(info: any) {
  const text = await loadFile(info.url);
  info.file = parseData(text);
  return info.file;
}

async function loadAll() {
  const fileInfos: any = [
    { name: 'men', hueRange: [0.6, 0.4], url: './gis-data/earth.asc' },
    { name: 'women', hueRange: [1.0, 1.0], url: './gis-data/woman.asc' },
  ];
  const [manData, womanData] = await Promise.all(fileInfos.map(loadData));

  function mapValues(data: any, fn: any) {
    return data.map((row: any, rowNdx: any) => {
      return row.map((value: any, colNdx: any) => {
        return fn(value, rowNdx, colNdx);
      });
    });
  }

  function makeDiffFile(baseFile: any, otherFile: any, compareFn: any) {
    let min: any;
    let max: any;
    const baseData = baseFile.data;
    const otherData = otherFile.data;
    const data = mapValues(baseData, (base: any, rowNdx: any, colNdx: any) => {
      const other = otherData[rowNdx][colNdx];
      if (base === undefined || other === undefined) {
        return undefined;
      }
      const value = compareFn(base, other);
      min = Math.min(min === undefined ? value : min, value);
      max = Math.max(max === undefined ? value : max, value);
      return value;
    });
    // make a copy of baseFile and replace min, max, and data
    // with the new data
    return { ...baseFile, min, max, data };
  }

  {
    const menFile = manData;
    const womenFile = womanData;

    function amountGreaterThan(a: any, b: any) {
      return Math.max(a - b, 0);
    }

    fileInfos.push({
      name: '>50%men',
      hueRange: [0.8, 1.2],
      file: makeDiffFile(menFile, womenFile, (men: any, women: any) => {
        return amountGreaterThan(men, women);
      }),
    });
    fileInfos.push({
      name: '>50% women',
      hueRange: [0.5, 0.4],
      file: makeDiffFile(womenFile, menFile, (women: any, men: any) => {
        return amountGreaterThan(women, men);
      }),
    });
  }

  return fileInfos;


  // const geometries = fileInfos.map( ( info ) => {
  //   return makeBoxes( info.file, info.hueRange, fileInfos );
  // } );



}

export { loadAll };
