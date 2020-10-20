const c = document.getElementById("mainCanvas");
const ctx = c.getContext("2d");
const MX = document.getElementById("mouseX");
const MY = document.getElementById("mouseY");
let isRotating = true;
let isPartiallyDrawn = false;
// import Cube from "./modules/Cube.js";
// import Sphere from "./modules/Sphere.js";
import Torus from "./modules/Torus.js";

const rotationButton = document.getElementById("rotationButton");
const partiallyButton = document.getElementById("partiallyButton");

const fps = 48;
const config = {
  VRP: [[1, 1, 0]],
  VPN: [[1, 1, 1]],
  VUP: [[1, 0, 0]],
  COP: [[0, 0, 2]],
  backFaceCulling: true,
};

const center = { x: 0, y: 0, z: 0 };

const clear = () => {
  ctx.clearRect(0, 0, c.width, c.height);
};

const generateFPS = (FPS) => {
  return 1000 / FPS;
};

// Torus(centerRadius, circleRadius, centerDetail, circleDetail, center)
const torus1 = new Torus(200, 40, 20, 20, center, config);

torus1.generateTorus();
// torus1.rotateTorusX(0);
// torus1.rotateTorusY(0);
// torus1.rotateTorusZ(0);
torus1.drawTorus();
// clear();
rotationButton.onclick = () => {
  isRotating = !isRotating;
  isPartiallyDrawn = false;
};

partiallyButton.onclick = () => {
  clear();
  isRotating = false;
  isPartiallyDrawn = true;
};

setInterval(() => {
  if (isRotating) {
    clear();
    torus1.rotateTorusX(60 / fps);
    torus1.rotateTorusY(10 / fps);
    torus1.rotateTorusZ(10 / fps);
    torus1.drawTorus();
  } else if (isPartiallyDrawn) {
    torus1.drawPartially();
  }
}, generateFPS(fps));

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
