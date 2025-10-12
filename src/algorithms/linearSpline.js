// Linear spline interpolation algorithm
// Exports named `linearSpline` and default
export function linearSpline(xs, ys, x) {
  const n = xs.length;
  let segs = [];

  // build line segments
  for (let i = 0; i < n - 1; i++) {
    const slope = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
    const intercept = ys[i] - slope * xs[i];
    segs.push({ i, x1: xs[i], x2: xs[i + 1], slope, intercept });
  }

  // find segment containing x
  let found = segs.find((s) => x >= s.x1 && x <= s.x2);
  if (!found) {
    throw new Error("ค่า x อยู่นอกขอบเขตข้อมูล");
  }

  const fx = found.slope * x + found.intercept;
  return { fx, segs, found };
}

export default linearSpline;
