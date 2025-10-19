export function compositeTrapezoidal(a, b, n, f) {
  try {
    const h = (b - a) / n;
    const fa = f(a), fb = f(b);
    let sum = fa + fb;
    const rows = [{ i: 0, x: a, fx: fa }];
    for (let i = 1; i < n; i++) {
      const xi = a + i * h, fx = f(xi);
      sum += 2 * fx;
      rows.push({ i, x: xi, fx });
    }
    rows.push({ i: n, x: b, fx: fb });
    return { I: (h / 2) * sum, h, rows };
  } catch (e) { return { error: String(e) }; }
}

export default compositeTrapezoidal;
