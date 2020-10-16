import { mmultiply } from "./utils.js";

const Rotation = (points, matrix) => {
  let rotatedPoint = [];

  points.map((face, index) => {
    const { x, y, z } = face;
    const results = mmultiply(matrix, [[x], [y], [z], [1]]);
    rotatedPoint[index] = {
      x: results[0][0],
      y: results[1][0],
      z: results[2][0],
    };
  });
  return rotatedPoint;
};

export const RotateX = (angle, points) => {
  angle = (angle * Math.PI) / 180;
  const matrix = [
    [1, 0, 0, 0],
    [0, Math.cos(angle), Math.sin(angle), 0],
    [0, -Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 0, 1],
  ];
  return Rotation(points, matrix);
};

export const RotateY = (angle, points) => {
  angle = (angle * Math.PI) / 180;
  const matrix = [
    [Math.cos(angle), 0, -Math.sin(angle), 0],
    [0, 1, 0, 0],
    [Math.sin(angle), 0, Math.cos(angle), 0],
    [0, 0, 0, 1],
  ];
  return Rotation(points, matrix);
};

export const RotateZ = (angle, points) => {
  angle = (angle * Math.PI) / 180;
  const matrix = [
    [Math.cos(angle), -Math.sin(angle), 0, 0],
    [Math.sin(angle), Math.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  return Rotation(points, matrix);
};
