// Quadratic interpolation (Lagrange form for 3 points)
export function quadraticInterpolation(xs, ys, x) {
  if (xs.length !== 3 || ys.length !== 3) throw new Error("ต้องมีข้อมูล 3 จุดเท่านั้น");

  const [x0, x1, x2] = xs;
  const [y0, y1, y2] = ys;

  const L0 = ((x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2));
  const L1 = ((x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2));
  const L2 = ((x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1));

  const fx = y0 * L0 + y1 * L1 + y2 * L2;
  return { fx, L0, L1, L2 };
}

export default quadraticInterpolation;
