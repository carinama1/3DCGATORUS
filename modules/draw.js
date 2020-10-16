/**
  @method draw
  @param {from} [x,y]
  @param {to} [x,y]
  @ctx context
*/
const c = document.getElementById("mainCanvas");
const ctx = c.getContext("2d");

export const drawDot = (point, style = "black") => {
  const { x, y } = point;
  ctx.fillRect(x, y, 1, 1);
  ctx.strokeStyle = style;
  ctx.stroke();
};

export const draw = (from, to, style = "black") => {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = style;
  ctx.stroke();
};
