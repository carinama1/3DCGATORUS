import {
  getMap,
  xyz,
  transformCenter,
  transpose,
  vectorLength,
  calcMatrix,
  dotproduct,
  crossProduct,
  toVector,
} from "./utils.js";
import { drawDot, draw } from "./draw.js";
import { RotateX, RotateY, RotateZ } from "./Rotation.js";

export default class Torus {
  constructor(R, r, centerDetail, circleDetail = 30, center, config) {
    this.R = R;
    this.r = r;
    this.centerDetail = centerDetail;
    this.center = center;
    this.points = [];
    this.circleDetail = circleDetail;
    this.line = [];
    this.faces = [];
    this.config = config;
    this.visibleFaces = [];
    this.part = 0;
    this.linepart = 0;
  }

  translateTo3D = () => {
    const { VRP, VPN, VUP, COP } = this.config;
    // Calculate Normal
    let N = transpose(VPN);
    let length = vectorLength(N);
    N = calcMatrix(N, length, "/");
    // calculate UP
    let up = transpose(VUP);
    length = vectorLength(up);
    up = calcMatrix(up, length, "/");
    const newUp = calcMatrix(up, calcMatrix(N, dotproduct(up, N), "*"), "-");
    // calculate v
    const v = calcMatrix(newUp, vectorLength(newUp), "/");
    // calculate u
    const u = crossProduct(v, N);
    // console.log(u);
  };

  area = (A, B, P) => {
    const x1 = A.x;
    const y1 = A.y;
    const x2 = B.x;
    const y2 = B.y;
    const x3 = P.x;
    const y3 = P.y;
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  };

  isInside = (A, B, C, D, point) => {
    // if (x > x1 && x < x2 && y > y1 && y < y2) return true;
    // let A =

    // return false;
    const Area = this.area(A, B, D) + this.area(B, C, D);
    const A1 = this.area(A, B, point);
    const A2 = this.area(B, C, point);
    const A3 = this.area(C, D, point);
    const A4 = this.area(D, A, point);
    return Area === A1 + A2 + A3 + A4;
  };

  handleClick = (pos) => {
    const { x, y } = pos;
    const { visibleFaces } = this;
    visibleFaces.map((face, index) => {
      const A = transformCenter(face[0], this.center);
      const B = transformCenter(face[1], this.center);
      const C = transformCenter(face[2], this.center);
      const D = transformCenter(face[3], this.center);
      if (this.isInside(A, B, C, D, { x, y })) {
        console.log(
          "N : ",
          this.backCulling(face, true),
          "index : ",
          index,
          "totalFace : ",
          this.faces.length
        );
        this.drawShape(face, "red");
      }
    });
  };

  generateFaces = () => {
    const { line } = this;
    const temp = [];
    for (let i = 0; i < line.length; i++) {
      for (let j = 0; j < line[i].length; j++) {
        if (i === line.length - 1 && j === line[i].length - 1) {
          temp.push([line[0][0], line[0][j], line[i][j], line[i][0]]);
          break;
        } else if (i === line.length - 1) {
          temp.push([line[0][j + 1], line[0][j], line[i][j], line[i][j + 1]]);
        } else if (j === line[i].length - 1) {
          temp.push([line[i + 1][0], line[i + 1][j], line[i][j], line[i][0]]);
        } else {
          temp.push([
            line[i + 1][j + 1],
            line[i + 1][j],
            line[i][j],
            line[i][j + 1],
          ]);
        }
      }
    }
    this.faces = temp;
    this.drawFaces();
  };

  backCulling = (face, value = false) => {
    const AB = toVector(face[0], face[1]);
    const BC = toVector(face[1], face[2]);
    const CD = toVector(face[2], face[3]);
    const DA = toVector(face[3], face[0]);
    // Product of 4
    // const normal = [
    //   crossProduct(AB, BC),
    //   crossProduct(BC, CD),
    //   crossProduct(CD, DA),
    //   crossProduct(DA, AB),
    // ];
    // let temp = 0;
    // normal.map((val) => {
    //   val.map((v) => {
    //     temp = temp + v[0];
    //   });
    // });

    // Product of 2
    const normal = crossProduct(CD, DA);
    let temp = 0;
    normal.map((v) => {
      temp = temp + v[0];
    });

    if (value) {
      return temp;
    }
    if (temp > 0) {
      return true;
    }
    return false;
  };

  drawPartially = () => {
    let { faces, part, linepart, center } = this;
    if (part === faces.length) {
      return;
    }
    if (linepart === 3) {
      draw(
        transformCenter(faces[part][linepart], center),
        transformCenter(faces[part][0], center)
      );
      this.linepart = 0;
      this.part += 1;
    } else {
      draw(
        transformCenter(faces[part][linepart], center),
        transformCenter(faces[part][linepart + 1], center),
        center
      );
      this.linepart += 1;
    }
  };

  drawFaces = () => {
    const { backFaceCulling } = this.config;
    this.faces.map((face) => {
      if (backFaceCulling) {
        if (this.backCulling(face)) {
          this.visibleFaces.push(face);
          this.drawShape(face);
        }
      } else {
        this.visibleFaces.push(face);
        this.drawShape(face);
      }
    });
  };

  generateTorus = () => {
    let temp = [];
    for (let i = 0; i < this.centerDetail; i++) {
      const long = getMap(i, 0, this.centerDetail, 0, Math.PI * 2);
      let tempLine = [];
      for (let j = 0; j < this.circleDetail; j++) {
        const lat = getMap(j, 0, this.circleDetail, 0, Math.PI * 2);
        const x = (this.R + this.r * Math.cos(lat)) * Math.cos(long);
        const y = (this.R + this.r * Math.cos(lat)) * Math.sin(long);
        const z = this.r * Math.sin(lat);

        const point = xyz(x, y, z);
        temp.push(point);
        tempLine.push(point);
      }
      this.line.push(tempLine);
    }
    this.points = temp;
  };

  generateLine = () => {
    const { points } = this;
    let temp = [];
    let matrices = [];
    points.map((point, index) => {
      matrices.push(point);
      if ((index + 1) % this.circleDetail === 0) {
        temp[(index + 1) / this.circleDetail - 1] = matrices;
        matrices = [];
      }
    });
    this.line = temp;
  };

  drawTorus = () => {
    // const { points } = this;
    // points.map((point) => {
    //   drawDot(transformCenter(point, this.center), this.center);
    // });
    this.generateLine();
    this.generateFaces();
    this.translateTo3D();
  };

  drawShape = (face, style) => {
    draw(
      transformCenter(face[0], this.center),
      transformCenter(face[1], this.center),
      style
    );
    draw(
      transformCenter(face[1], this.center),
      transformCenter(face[2], this.center),
      style
    );
    draw(
      transformCenter(face[2], this.center),
      transformCenter(face[3], this.center),
      style
    );
    draw(
      transformCenter(face[3], this.center),
      transformCenter(face[0], this.center),
      style
    );
  };

  rotateTorusX = (angle) => {
    this.points = RotateX(angle, this.points);
  };

  rotateTorusY = (angle) => {
    this.points = RotateY(angle, this.points);
  };
  rotateTorusZ = (angle) => {
    this.points = RotateZ(angle, this.points);
  };
}
