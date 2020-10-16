import { draw, drawDot } from "./draw.js";
import { xyz, transformCenter, chunk, mmultiply, getMap } from "./utils.js";
import { RotateX, RotateY } from "./Rotation.js";

export default class Sphere {
  constructor(detail, radius, center = { x: 0, y: 0, z: 0 }) {
    this.detail = detail;
    this.radius = radius;
    this.faces = [];
    this.center = center;
  }

  generateSphere = () => {
    let temp = [];
    for (let i = 0; i < this.detail; i++) {
      const long = getMap(i, 0, this.detail, -Math.PI, Math.PI);
      for (let j = 0; j < this.detail; j++) {
        const lat = getMap(j, 0, this.detail, -Math.PI / 2, Math.PI / 2);

        const x = this.radius * Math.sin(long) * Math.cos(lat);
        const y = this.radius * Math.sin(long) * Math.sin(lat);
        const z = this.radius * Math.cos(long);

        const point = xyz(x, y, z);
        temp.push(point);
      }
    }
    // this.faces = chunk(temp, 3);
    this.faces = temp;
  };

  rotateSphereX = (angle) => {
    this.faces = RotateX(angle, this.faces);
  };

  rotateSphereY = (angle) => {
    this.faces = RotateY(angle, this.faces);
  };

  drawSphere = () => {
    const { faces } = this;
    faces.map((face) => {
      drawDot(transformCenter(face, this.center));
    });
  };
}
