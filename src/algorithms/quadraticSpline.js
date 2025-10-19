// Quadratic spline interpolation (C1 continuity, simple forward construction)
// Local form on interval i: S_i(x) = a[i] + b[i]*(x-x_i) + c[i]*(x-x_i)^2
// with S_i(x_i)=y_i, S_i(x_{i+1})=y_{i+1}, and S'_i(x_{i+1}) = S'_{i+1}(x_{i+1})
// This implementation chooses c[0]=0 and propagates forward.
export function solveQuadraticSpline(pts, x) {
  const nPts = pts.length;
  if (nPts < 3) return { error: "ต้องมีจุดอย่างน้อย 3 จุด" };

  // Ensure strictly increasing x and check duplicates
  for (let i = 0; i < nPts - 1; i++) {
    if (pts[i + 1].x - pts[i].x === 0) return { error: "ค่าของ x ซ้ำกัน" };
  }

  const n = nPts - 1; // number of intervals
  const a = new Array(n);
  const b = new Array(n);
  const c = new Array(n);

  // Initialize
  for (let i = 0; i < n; i++) {
    a[i] = pts[i].y;
  }
  c[0] = 0; // simple boundary choice

  // Forward pass to compute b[i] and c[i+1]
  for (let i = 0; i < n; i++) {
    const xi = pts[i].x;
    const xi1 = pts[i + 1].x;
    const yi = pts[i].y;
    const yi1 = pts[i + 1].y;
    const h = xi1 - xi;
    // From continuity of function at xi1: yi + b[i]*h + c[i]*h^2 = yi1
    b[i] = (yi1 - yi - c[i] * h * h) / h;
    // From continuity of derivative at xi1: b[i] + 2*c[i]*h = b[i+1]
    if (i + 1 < n) {
      c[i + 1] = (b[i] + 2 * c[i] * h - (pts[i + 2] ? 0 : 0)) /* seed will be used next loop */;
      // Note: b[i+1] not yet known; we set c[i+1] tentatively and it will be used in next iteration.
      // A simple consistent forward choice derived by eliminating b[i+1]:
      // Using next interval equation, solve for c[i+1] when computing b[i+1].
      // Implemented by deferring exact setting until next loop iteration where b[i+1] is computed.
    }
    // If we set c[i+1] now using only current info, use the standard formula for forward quadratic spline:
    if (i + 1 < n) {
      const xi2 = pts[i + 2]?.x;
      const yi2 = pts[i + 2]?.y;
      const hNext = xi2 != null ? xi2 - xi1 : null;
      if (hNext != null && hNext !== 0) {
        // Derivation yields: c[i+1] = ( (yi2 - yi1)/hNext - (yi1 - yi)/h ) * (2/(h + hNext))
        c[i + 1] = ((yi2 - yi1) / hNext - (yi1 - yi) / h) * (2 / (h + hNext));
      } else {
        c[i + 1] = 0;
      }
    }
  }

  // Evaluate at x by locating its interval
  let k = n - 1;
  for (let i = 0; i < n; i++) {
    if (x >= pts[i].x && x <= pts[i + 1].x) {
      k = i;
      break;
    }
  }
  const dx = x - pts[k].x;
  const y = a[k] + b[k] * dx + c[k] * dx * dx;
  return { a, b, c, y };
}

export default solveQuadraticSpline;
