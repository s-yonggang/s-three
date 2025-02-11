async function loadFile(url: any) {
  const req = await fetch(url);
  return req.text();
}

function parseData(text: string) {

  const data: Array<number | string> = [];
  const settings: any = { data };
  let max: any;
  let min: any;
  // split into lines
  text.split('\n').forEach((line: any) => {
    // split the line by whitespace
    const parts = line.trim().split(/\s+/);
    if (parts.length === 2) {
      // only 2 parts, must be a key/value pair
      settings[parts[0]] = parseFloat(parts[1]);
    } else if (parts.length > 2) {
      // more than 2 parts, must be data
      const values = parts.map((v: any) => {
        const value = parseFloat(v);
        if (value === settings.NODATA_value) {
          return undefined;
        }
        max = Math.max(max === undefined ? value : max, value);
        min = Math.min(min === undefined ? value : min, value);
        return value;
      });
      data.push(values);
    }
  });
  return Object.assign(settings, { min, max });
}

function dataMissingInAnySet(fileInfos:any, latNdx:any, lonNdx:any) {
  for (const fileInfo of fileInfos) {
    if (fileInfo.file.data[latNdx][lonNdx] === undefined) {
      return true;
    }
  }
  return false;
}

