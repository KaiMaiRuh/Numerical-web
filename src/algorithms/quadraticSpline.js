// Quadratic spline helper (simplified local quadratic per segment)
export function solveQuadraticSpline(pts, x) {
  if (pts.length < 3) return { error: "ต้องมีจุดอย่างน้อย 3 จุด" };
  const n = pts.length - 1;
  const a = [];
  const b = [];
  const c = [];

  for (let i = 0; i < n; i++) {
    const x0 = pts[i].x;
    const x1 = pts[i + 1].x;
    const y0 = pts[i].y;
    const y1 = pts[i + 1].y;
    const h = x1 - x0;
    if (h === 0) return { error: "ค่าของ x ซ้ำกัน" };

    a[i] = y0;
    b[i] = (y1 - y0) / h;
    c[i] = 0;
  }

  let i = 0;
  for (let j = 0; j < n; j++) {
    if (x >= pts[j].x && x <= pts[j + 1].x) {
      i = j;
      break;
    }
  }

  const dx = x - pts[i].x;
  const y = a[i] + b[i] * dx + c[i] * dx * dx;
  return { a, b, c, y };
}

export default solveQuadraticSpline;
