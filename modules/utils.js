const c = document.getElementById("mainCanvas");

export const getMap = (value, min, max, newmin, newmax) => {
  return ((value - min) * (newmax - newmin)) / (max - min) + newmin;
};

export const transformCenter = (point, center) => {
  let { x, y, z } = center;
  x = c.width / 2 + x;
  y = c.height / 2 + y;

  return { x: point.x + x, y: point.y + y, z: point.z + z };
};

export const chunk = (arr, len) => {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};

export const xyz = (x, y, z = 0) => {
  return { x, y, z };
};

const pow = (vector, power) => {
  return Math.pow(vector, power);
};

export const calcMatrix = (matrix, value, operator) => {
  return matrix.map((mat, a) => {
    return mat.map((m, b) => {
      if (operator === "/") return m / value;
      if (operator === "*") return m * value;
      if (operator === "-") return m - value[b];
      if (operator === "+") return m + value[b];
    });
  });
};

export const vectorLength = (vector) => {
  return Math.sqrt(
    pow(vector[0][0], 2) + pow(vector[1][0], 2) + pow(vector[2][0], 2)
  );
};

export const dotproduct = function (a, b) {
  return a
    .map(function (x, i) {
      return a[i] * b[i];
    })
    .reduce(function (m, n) {
      return m + n;
    });
};

export const toVector = (a, b) => {
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
};

const toArray = (obj) => {
  const { x, y, z } = obj;
  return [x, y, z];
};

export const crossProduct = (a, b) => {
  if (typeof a === "object") {
    a = toArray(a);
    b = toArray(b);
  }
  return [
    [a[1] * b[2] - b[1] * a[2]],
    [-(a[0] * b[2] - b[0] * a[2])],
    [a[0] * b[1] - b[0] * a[1]],
  ];
};

export const transpose = function (a) {
  return a[0].map(function (x, i) {
    return a.map(function (y, k) {
      return y[i];
    });
  });
};

export const mmultiply = function (a, b) {
  return a.map(function (x, i) {
    return transpose(b).map(function (y, k) {
      return dotproduct(x, y);
    });
  });
};
