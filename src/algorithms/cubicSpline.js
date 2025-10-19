export function solveCubicSpline(pts, x) {
  try {
    const n = pts.length; if (n < 3) return { error: "ต้องมีจุดอย่างน้อย 3 จุด" };
    const a = pts.map((p) => p.y);
    const h = Array.from({ length: n - 1 }, (_, i) => pts[i + 1].x - pts[i].x);
    if (h.some((v) => v === 0)) return { error: "ค่าของ x ซ้ำกัน" };

    const alpha = Array(n).fill(0), l = Array(n).fill(0), mu = Array(n).fill(0), z = Array(n).fill(0);
    const b = Array(n).fill(0), c = Array(n).fill(0), d = Array(n).fill(0);
    for (let i = 1; i < n - 1; i++) alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
    l[0] = 1; for (let i = 1; i < n - 1; i++) { l[i] = 2 * (pts[i + 1].x - pts[i - 1].x) - h[i - 1] * mu[i - 1]; mu[i] = h[i] / l[i]; z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i]; }
    l[n - 1] = 1; z[n - 1] = 0; c[n - 1] = 0;
    for (let j = n - 2; j >= 0; j--) { c[j] = z[j] - mu[j] * c[j + 1]; b[j] = (a[j + 1] - a[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3; d[j] = (c[j + 1] - c[j]) / (3 * h[j]); }

    let i = n - 2; for (let j = 0; j < n - 1; j++) if (x >= pts[j].x && x <= pts[j + 1].x) { i = j; break; }
    const dx = x - pts[i].x, y = a[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
    return { a, b, c, d, y };
  } catch (e) { return { error: String(e) }; }
}

export default solveCubicSpline;
