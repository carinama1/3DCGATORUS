import {
  getMap,
  xyz,
  transformCenter,
  transpose,
  vectorLength,
  calcMatrix,
  dotproduct,
  crossProduct,
  mmultiply,
  toMatrix,
  toPoint,
  toVector,
} from "./utils.js";
import { drawDot, draw } from "./draw.js";
import { RotateX, RotateY, RotateZ } from "./Rotation.js";
const c = document.getElementById("mainCanvas");
const ctx = c.getContext("2d");

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
    const { points } = this;
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
    let r = calcMatrix(transpose(VRP), -1, "*");
    r = [[dotproduct(r, u)], [dotproduct(r, v)], [dotproduct(r, N)]];
    // console.log(r);
    // console.log("u", u);
    // console.log("v", v);
    // console.log("N", N);
    const AWV = [
      [u[0][0], v[0][0], N[0][0], 0],
      [u[1][0], v[1][0], N[1][0], 0],
      [u[2][0], v[2][0], N[2][0], 0],
      [r[0][0], r[1][0], r[2][0], 1],
    ];
    const width = c.width / 2;
    const height = c.height / 2;

    const CW = [(width + -width) / 2, (height + -height) / 2, 0];
    const DOP = [CW[0] - COP[0][0], CW[1] - COP[0][1], CW[2] - COP[0][2]];
    const shx = -DOP[0] / DOP[2];
    const shy = -DOP[1] / DOP[2];
    let T3 = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [shx, shy, 1, 0],
      [0, 0, 0, 1],
    ];
    T3 = mmultiply(AWV, T3);
    // console.log(T3);
    // console.log(toMatrix(points[0]));
    let temp = [];
    points.map((point) => {
      temp.push(toPoint(mmultiply(T3, toMatrix(point))));
    });
    return temp;
    // console.log(COP);
    // console.log(AWV);
  };

  area = (A, B, P) => {
    const x1 = A.x;
    const y1 = A.y;
    const x2 = B.x;
    const y2 = B.y;
    const x3 = P.x;
    const y3 = P.y;
    return Math.abs(
      (x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2) / 2.0
    );
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
        console.log("N : ", this.backCulling(face, true));
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
          temp.push([line[i][0], line[i][j], line[0][j], line[0][0]]);
          break;
        } else if (i === line.length - 1) {
          temp.push([line[i][j + 1], line[i][j], line[0][j], line[0][j + 1]]);
        } else if (j === line[i].length - 1) {
          temp.push([line[i][0], line[i][j], line[i + 1][j], line[i + 1][0]]);
        } else {
          temp.push([
            line[i][j + 1],
            line[i][j],
            line[i + 1][j],
            line[i + 1][j + 1],
          ]);
        }
      }
    }
    this.faces = temp;
    this.drawFaces();
  };

  transformFaceCenter = (face) => {
    return [
      transformCenter(face[0], this.center),
      transformCenter(face[1], this.center),
      transformCenter(face[2], this.center),
      transformCenter(face[3], this.center),
    ];
  };

  backCulling = (points, value = false) => {
    const AB = toVector(points[0], points[1]);
    const BC = toVector(points[1], points[2]);
    const normal = crossProduct(AB, BC);
    let temp = 0;
    temp = normal[2];
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

      // console.log(this.backCulling(faces[part], true));

      if ((part + 1) % 20 === 0) {
        console.clear();
        ctx.clearRect(0, 0, c.width, c.height);
      }
    } else {
      draw(
        transformCenter(faces[part][linepart], center),
        transformCenter(faces[part][linepart + 1], center),
        center
      );
      this.linepart += 1;
    }
  };

  drawFaces = (version) => {
    // console.log(version, this.faces[0]);
    const { backFaceCulling } = this.config;
    this.visibleFaces = [];
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

  // toggleBackFaceCulling = (config) => {
  //   this.config = config;

  //   this.generateTorus();
  // };

  generateNewTorus = (
    R,
    r,
    centerDetail,
    circleDetail = 30,
    center,
    config
  ) => {
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

    this.generateTorus();
  };

  generateTorus = () => {
    let temp = [];
    for (let i = 0; i < this.centerDetail; i++) {
      const long = getMap(i, 0, this.centerDetail, Math.PI * 2, 0);
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

  generateLine = (points) => {
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

  drawTorusV2 = () => {
    // console.log("1", this.points[0]);
    // console.log("face1", this.faces[0]);
    // console.log("line1", this.line[0]);
    this.points = this.translateTo3D();
    // console.log("2", this.points[0]);
    // console.log("face2", this.faces[0]);
    this.drawFaces("v2");
  };

  drawTorus = () => {
    // points.map((point) => {
    //   drawDot(transformCenter(point, this.center), this.center);
    // });
    const points = this.translateTo3D();
    this.generateLine(points);
    this.generateFaces();
    // points.map((point) => {
    //   drawDot(transformCenter(point, this.center));
    // });
  };

  drawShape = (face, style) => {
    // console.log("s");
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
