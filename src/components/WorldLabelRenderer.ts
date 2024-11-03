import { Vector3, BufferGeometry, LineDashedMaterial, Line } from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

function createLabelRenderer(width: any, height: any) {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  return labelRenderer
}

function createLabelDiv(color: any = "#000", bgColor: any = "#ffffff") {
  return (text: any) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "label";
    // lineDiv.textContent = text;
    lineDiv.style.backgroundColor = bgColor;
    // lineDiv.style.width = "4rem";
    // lineDiv.style.height = "4rem";
    lineDiv.style.padding = "0 10px";
    lineDiv.style.color = color;
    lineDiv.style.fontSize = "12px";
    lineDiv.style.border = "0.5px solid #333333";
    lineDiv.style.borderRadius = "4px";
    const devLabel = new CSS2DObject(lineDiv);
    devLabel.position.set(0, 1, 0);
    devLabel.center.set(0.5, 1.0);
    devLabel.layers.set(0);
    devLabel.element.innerText = text;
    devLabel.element.innerHTML = text;
    return devLabel;
  }
}

function createLabelLine(lineHight: number = 2, lineColor: any = 0xff0000, linePosition: number[] = [0, 2, 0]) {
  // 线
  const points = [
    new Vector3(0, 0, 0),
    new Vector3(0, lineHight, 0),
    new Vector3(0, 0, 0),
  ];
  const lineGeometry = new BufferGeometry().setFromPoints(points);
  const lineMaterial = new LineDashedMaterial({ // 线材质
    color: lineColor,
    linewidth: 1,
    scale: 1,
  });
  const line = new Line(lineGeometry, lineMaterial);
  line.position.x = linePosition[0];
  line.position.y = linePosition[1];
  line.position.z = linePosition[2];
  line.layers.enableAll();
  return line;
}

export { createLabelDiv, createLabelLine, createLabelRenderer }
