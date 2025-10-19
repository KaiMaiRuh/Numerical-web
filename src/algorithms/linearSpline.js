// Linear spline interpolation algorithm
// Exports named `linearSpline` and default
export function linearSpline(xs, ys, x) {
  try {
    const n = xs.length; const segs = [];
    for (let i = 0; i < n - 1; i++) {
      const slope = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
      const intercept = ys[i] - slope * xs[i];
      segs.push({ i, x1: xs[i], x2: xs[i + 1], slope, intercept });
    }
    const found = segs.find((s) => x >= s.x1 && x <= s.x2);
    if (!found) return { error: "ค่า x อยู่นอกขอบเขตข้อมูล" };
    return { fx: found.slope * x + found.intercept, segs, found };
  } catch (e) { return { error: String(e) }; }
}

export default linearSpline;
