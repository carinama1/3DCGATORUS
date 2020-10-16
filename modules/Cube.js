import { draw } from "./draw.js";
import { mmultiply, xyz } from "./utils.js";
const c = document.getElementById("mainCanvas");

const defaultCenter = { x: 0, y: 0, z: 0 };

const transformCenter = (point, center) => {
  let { x, y, z } = center;
  x = c.width / 2 + x;
  y = c.height / 2 + y;

  return { x: point.x + x, y: point.y + y, z: point.z + z };
};

export default class Cube {
  constructor(width, height, length, center, name) {
    this.width = width;
    this.height = height;
    this.length = length;
    this.center = center;
    this.name = name;
    this.faces = {};
  }

  transformationMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ];

  projection3D = (points) => {
    const { x, y, z } = points;
    const matrix = [[x, y, z, 1]];
    const results = mmultiply(matrix, this.transformationMatrix);
    //   console.log({ x: results[0][0], y: results[0][1], z: results[0][2] });
    return { x: results[0][0], y: results[0][1], z: results[0][2] };
  };

  generateCube = () => {
    const { length, width, height, center } = this;
    let p1 = xyz(-width, -height, length);
    let p2 = xyz(width, -height, length);
    let p3 = xyz(width, height, length);
    let p4 = xyz(-width, height, length);
    let p5 = xyz(-width, height, -length);
    let p6 = xyz(width, height, -length);
    let p7 = xyz(width, -height, -length);
    let p8 = xyz(-width, -height, -length);

    // p1 = transformCenter(this.projection3D(p1), center);
    // p2 = transformCenter(this.projection3D(p2), center);
    // p3 = transformCenter(this.projection3D(p3), center);
    // p4 = transformCenter(this.projection3D(p4), center);
    // p5 = transformCenter(this.projection3D(p5), center);
    // p6 = transformCenter(this.projection3D(p6), center);
    // p7 = transformCenter(this.projection3D(p7), center);
    // p8 = transformCenter(this.projection3D(p8), center);

    let faces = { p1, p2, p3, p4, p5, p6, p7, p8 };

    this.faces = faces;

    this.drawCube(faces);
  };

  drawCube = () => {
    const { center } = this;
    let { p1, p2, p3, p4, p5, p6, p7, p8 } = this.faces;

    p1 = transformCenter(p1, center);
    p2 = transformCenter(p2, center);
    p3 = transformCenter(p3, center);
    p4 = transformCenter(p4, center);
    p5 = transformCenter(p5, center);
    p6 = transformCenter(p6, center);
    p7 = transformCenter(p7, center);
    p8 = transformCenter(p8, center);

    let faces = [
      [p1, p2, p3, p4],
      [p4, p5, p6, p3],
      [p5, p6, p7, p8],
      [p2, p3, p6, p7],
      [p1, p2, p7, p8],
      [p1, p4, p5, p8],
    ];

    faces.map((face) => {
      draw(face[0], face[1]);
      draw(face[1], face[2]);
      draw(face[2], face[3]);
      draw(face[3], face[0]);
    });
  };

  rotateCubeX = (angle) => {
    angle = (angle * Math.PI) / 180;
    const matrix = [
      [1, 0, 0, 0],
      [0, Math.cos(angle), Math.sin(angle), 0],
      [0, -Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 0, 1],
    ];
    let rotatedPoint = {};

    for (const [key, value] of Object.entries(this.faces)) {
      const { x, y, z } = value;
      const results = mmultiply(matrix, [[x], [y], [z], [1]]);

      rotatedPoint[key] = {
        x: results[0][0],
        y: results[1][0],
        z: results[2][0],
      };
    }
    this.faces = rotatedPoint;
    // console.log(
    //   mmultiply(
    //     [
    //       [2, 2],
    //       [1, 3],
    //     ],
    //     [
    //       [2, 1],
    //       [4, 5],
    //     ]
    //   )
    // );
  };

  rotateCubeY = (angle) => {
    angle = (angle * Math.PI) / 180;
    const matrix = [
      [Math.cos(angle), 0, -Math.sin(angle), 0],
      [0, 1, 0, 0],
      [Math.sin(angle), 0, Math.cos(angle), 0],
      [0, 0, 0, 1],
    ];
    let rotatedPoint = {};

    for (const [key, value] of Object.entries(this.faces)) {
      const { x, y, z } = value;
      const results = mmultiply(matrix, [[x], [y], [z], [1]]);

      rotatedPoint[key] = {
        x: results[0][0],
        y: results[1][0],
        z: results[2][0],
      };
    }

    this.faces = rotatedPoint;
  };
}
