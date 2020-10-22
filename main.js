const c = document.getElementById("mainCanvas");
const ctx = c.getContext("2d");
const MX = document.getElementById("mouseX");
const MY = document.getElementById("mouseY");
let isRotating = false;
let isPartiallyDrawn = false;
// import Cube from "./modules/Cube.js";
// import Sphere from "./modules/Sphere.js";
import { xyz } from "./modules/utils.js";
import Torus from "./modules/Torus.js";

const rotationButton = document.getElementById("rotationButton");
const backfaceButton = document.getElementById("backfaceButton");
const partiallyButton = document.getElementById("partiallyButton");
const refreshButton = document.getElementById("refreshButton");

//
let fps = document.getElementById("fpsvalue").value;
let rotationX = document.getElementById("rotationx").value;
let rotationY = document.getElementById("rotationy").value;
let rotationZ = document.getElementById("rotationz").value;
let translateX = document.getElementById("translateX").value;
let translateY = document.getElementById("translateY").value;
let translateZ = parseFloat(document.getElementById("translateZ").value / 10);

const translationXSlider = document.getElementById("translateX");
const translationYSlider = document.getElementById("translateY");
const translationZSlider = document.getElementById("translateZ");

let majorradius = document.getElementById("majorradius").value * 100;
let minorradius = document.getElementById("minorradius").value * 100;

let majordetail = document.getElementById("majordetail").value;
let minordetail = document.getElementById("minordetail").value;

let config = {
  VRP: [[1, 0, 0]],
  VPN: [[0, 0, 1]],
  VUP: [[1, 0, translateZ]],
  COP: [[0, 0, 4]],
  backFaceCulling: false,
};

if (translationXSlider) {
  translationXSlider.addEventListener("input", (e) => {
    resetTorus();
  });
}
if (translationYSlider) {
  translationYSlider.addEventListener("input", (e) => {
    resetTorus();
  });
}
if (translationZSlider) {
  translationZSlider.addEventListener("input", (e) => {
    resetTorus();
  });
}

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
if (backfaceButton) {
  backfaceButton.onclick = () => {
    const { backFaceCulling } = config;
    let status = "";
    if (backFaceCulling)
      status = '<span style="color:red; font-weight:bold">OFF</span>';
    else status = '<span style="color:green; font-weight:bold">ON</span>';
    config.backFaceCulling = !backFaceCulling;
    backfaceButton.innerHTML = `<span style="font-weight:bold">BACK FACE CULLING IS </span> ${status}`;
    resetTorus();
  };
}

if (rotationButton) {
  rotationButton.onclick = () => {
    isRotating = !isRotating;
    let status = "";
    if (!isRotating)
      status = '<span style="color:red; font-weight:bold">OFF</span>';
    else status = '<span style="color:green; font-weight:bold">ON</span>';
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
    MY.innerHTML = `Mouse Y : ${mousePos.y}`;
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

const torus1 = new Torus(
  majorradius,
  minorradius,
  majordetail,
  minordetail,
  center(),
  config
);

torus1.generateTorus();
torus1.rotateTorusX(rotationX);
torus1.rotateTorusY(rotationY);
torus1.rotateTorusZ(rotationZ);
torus1.drawTorus();
torus1.drawTorusV2();

const realtimefunction = () => {
  if (isRotating) {
    clear();
    torus1.rotateTorusX(rotationX / fps);
    torus1.rotateTorusY(rotationY / fps);
    torus1.rotateTorusZ(rotationZ / fps);
    // torus1.drawTorusV2();
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
  translateZ = parseFloat(document.getElementById("translateZ").value / 10);

  majorradius = document.getElementById("majorradius").value * 100;
  minorradius = document.getElementById("minorradius").value * 100;

  majordetail = document.getElementById("majordetail").value;
  minordetail = document.getElementById("minordetail").value;
};

const resetTorus = () => {
  getConfigurationValue();
  config.VUP[0][2] = translateZ;

  torus1.generateNewTorus(
    majorradius,
    minorradius,
    majordetail,
    minordetail,
    center(),
    config
  );
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
