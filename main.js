const c = document.getElementById("mainCanvas");
const ctx = c.getContext("2d");
const MX = document.getElementById("mouseX");
const MY = document.getElementById("mouseY");
let isRotating = true;
let isPartiallyDrawn = false;
// import Cube from "./modules/Cube.js";
// import Sphere from "./modules/Sphere.js";
import { xyz } from "./modules/utils.js";
import Torus from "./modules/Torus.js";

const rotationButton = document.getElementById("rotationButton");
const partiallyButton = document.getElementById("partiallyButton");
const refreshButton = document.getElementById("refreshButton");

//
let fps = document.getElementById("fpsvalue").value;
let rotationX = document.getElementById("rotationx").value;
let rotationY = document.getElementById("rotationy").value;
let rotationZ = document.getElementById("rotationz").value;
let translateX = document.getElementById("translateX").value;
let translateY = document.getElementById("translateY").value;
let translateZ = document.getElementById("translateZ").value;

const translationXSlider = document.getElementById("translateX");
const translationYSlider = document.getElementById("translateY");
const translationZSlider = document.getElementById("translateZ");

if (translationXSlider) {
  translationXSlider.addEventListener("input", (e) => {
    translateX = parseFloat(e.target.value);
    resetTorus();
  });
}
if (translationYSlider) {
  translationYSlider.addEventListener("input", (e) => {
    translateY = parseFloat(e.target.value);
    resetTorus();
  });
}

const config = {
  VRP: [[1, 0, 0]],
  VPN: [[0, 0, 1]],
  VUP: [[1, 0, 0]],
  COP: [[0, 0, 1]],
  backFaceCulling: true,
};

let center = () => {
  return xyz(
    parseFloat(translateX),
    -parseFloat(translateY),
    parseFloat(translateZ)
  );
};

const clear = () => {
  ctx.clearRect(0, 0, c.width, c.height);
};

const generateFPS = () => {
  const FPS = document.getElementById("fpsvalue").value;
  fps = FPS;
  return 1000 / FPS;
};

// Torus(centerRadius, circleRadius, centerDetail, circleDetail, center)

// clear();
if (rotationButton) {
  rotationButton.onclick = () => {
    isRotating = !isRotating;
    let status = "";
    if (!isRotating) status = '<span style="color:red;">OFF</span>';
    else status = '<span style="color:green;">ON</span>';
    rotationButton.innerHTML = `LIVE VIEW IS ${status}`;
    isPartiallyDrawn = false;
  };
}

if (partiallyButton) {
  partiallyButton.onclick = () => {
    clear();
    isRotating = false;
    isPartiallyDrawn = true;
  };
}

c.addEventListener(
  "mousemove",
  (e) => {
    var mousePos = getMousePos(c, e);
    MX.innerHTML = `Mouse X : ${mousePos.x}`;
    MY.innerHTML = `Mouse Y : ${mousePos.x}`;
  },
  false
);

c.addEventListener(
  "mousedown",
  (e) => {
    var mousePos = getMousePos(c, e);
    torus1.handleClick(mousePos);
  },
  false
);

const getMousePos = (canvas, e) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.ceil(e.clientX - rect.left),
    y: Math.ceil(e.clientY - rect.top),
  };
};

const torus1 = new Torus(100, 25, 20, 20, center(), config);

torus1.generateTorus();
// torus1.rotateTorusX(0);
// torus1.rotateTorusY(0);
// torus1.rotateTorusZ(0);
torus1.drawTorus();

const realtimefunction = () => {
  if (isRotating) {
    clear();
    torus1.rotateTorusX(rotationX / fps);
    torus1.rotateTorusY(rotationY / fps);
    torus1.rotateTorusZ(rotationZ / fps);
    torus1.drawTorus();
  }
};

let realtime = setInterval(() => {
  realtimefunction();
}, generateFPS());

const getConfigurationValue = () => {
  rotationX = document.getElementById("rotationx").value;
  rotationY = document.getElementById("rotationy").value;
  rotationZ = document.getElementById("rotationz").value;

  translateX = document.getElementById("translateX").value;
  translateY = document.getElementById("translateY").value;
  translateZ = document.getElementById("translateZ").value;
};

const resetTorus = () => {
  getConfigurationValue();
  torus1.generateNewTorus(100, 25, 20, 20, center(), config);
  clear();
  torus1.rotateTorusX(rotationX);
  torus1.rotateTorusY(rotationY);
  torus1.rotateTorusZ(rotationZ);
  torus1.drawTorus();
};

if (refreshButton) {
  refreshButton.onclick = () => {
    resetTorus();
    clearInterval(realtime);
    realtime = setInterval(() => {
      realtimefunction();
    }, generateFPS());
  };
}
// let cube1 = new Cube(50, 50, 50, center);
// let cube2 = new Cube(50, 50, 50, { x: -120, y: -120, z: 10 });
// let cube3 = new Cube(50, 50, 50, { x: 120, y: 120, z: 10 });
// let cube4 = new Cube(50, 50, 50, { x: -120, y: 120, z: 10 });
// let cube5 = new Cube(50, 50, 50, { x: 120, y: -120, z: 10 });
// let sphere1 = new Sphere(40, 200);
// cube1.generateCube();
// cube2.generateCube();
// cube3.generateCube();
// cube4.generateCube();
// cube5.generateCube();
// sphere1.generateSphere();

// setInterval(() => {
//   clear();
//   // cube1.rotateCubeX(30 / fps);
//   // cube1.rotateCubeY(20 / fps);
//   // cube2.rotateCubeX(30 / fps);
//   // cube2.rotateCubeY(40 / fps);
//   // cube3.rotateCubeX(30 / fps);
//   // cube3.rotateCubeY(50 / fps);
//   // cube4.rotateCubeX(30 / fps);
//   // cube4.rotateCubeY(60 / fps);
//   // cube5.rotateCubeX(30 / fps);
//   // cube5.rotateCubeY(70 / fps);
//   // cube1.drawCube();
//   // cube2.drawCube();
//   // cube3.drawCube();
//   // cube4.drawCube();
//   // cube5.drawCube();
//   sphere1.rotateSphereX(20 / fps);
//   sphere1.rotateSphereY(20 / fps);
//   sphere1.drawSphere();
// }, generateFPS(fps));
// sphere1.generateSphere();

// let cube2 = new Cube(20, 100, 200, center, "cube2");
// cube2.generateCube();
