// Quadratic spline interpolation (C1 continuity, simple forward construction)
// Local form on interval i: S_i(x) = a[i] + b[i]*(x-x_i) + c[i]*(x-x_i)^2
// with S_i(x_i)=y_i, S_i(x_{i+1})=y_{i+1}, and S'_i(x_{i+1}) = S'_{i+1}(x_{i+1})
// This implementation chooses c[0]=0 and propagates forward.
export function solveQuadraticSpline(pts, x) {
  const nPts = pts.length; if (nPts < 3) return { error: "ต้องมีจุดอย่างน้อย 3 จุด" };
  for (let i = 0; i < nPts - 1; i++) if (pts[i + 1].x - pts[i].x === 0) return { error: "ค่าของ x ซ้ำกัน" };
  const n = nPts - 1, a = Array(n).fill(0), b = Array(n).fill(0), c = Array(n).fill(0);
  for (let i = 0; i < n; i++) a[i] = pts[i].y; c[0] = 0;
  for (let i = 0; i < n; i++) {
    const xi = pts[i].x, xi1 = pts[i + 1].x, yi = pts[i].y, yi1 = pts[i + 1].y, h = xi1 - xi;
    b[i] = (yi1 - yi - c[i] * h * h) / h;
    if (i + 1 < n) {
      const xi2 = pts[i + 2]?.x, yi2 = pts[i + 2]?.y, hNext = xi2 != null ? xi2 - xi1 : null;
      c[i + 1] = hNext && hNext !== 0 ? ((yi2 - yi1) / hNext - (yi1 - yi) / h) * (2 / (h + hNext)) : 0;
    }
  }
  let k = n - 1; for (let i = 0; i < n; i++) if (x >= pts[i].x && x <= pts[i + 1].x) { k = i; break; }
  const dx = x - pts[k].x, y = a[k] + b[k] * dx + c[k] * dx * dx;
  return { a, b, c, y };
}

export default solveQuadraticSpline;
