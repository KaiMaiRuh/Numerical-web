// Newton's Second Divided-Difference (quadratic interpolation via divided differences)
export function secondDividedDiff(x0, x1, x2, fx0, fx1, fx2, x) {
  const f01 = (fx1 - fx0) / (x1 - x0);
  const f12 = (fx2 - fx1) / (x2 - x1);
  const f012 = (f12 - f01) / (x2 - x0);

  const Px = fx0 + f01 * (x - x0) + f012 * (x - x0) * (x - x1);
  return { f01, f12, f012, Px };
}

export default secondDividedDiff;
