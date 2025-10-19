export function compositeSimpson(a, b, n, f) {
  try {
    if (n % 2 !== 0) throw new Error("n ต้องเป็นจำนวนคู่เท่านั้น");
    const h = (b - a) / n;
    const fa = f(a), fb = f(b);
    let sum = fa + fb;
    const rows = [{ i: 0, x: a, fx: fa }];
    for (let i = 1; i < n; i++) {
      const xi = a + i * h;
      const fx = f(xi);
      sum += (i % 2 === 0 ? 2 : 4) * fx;
      rows.push({ i, x: xi, fx });
    }
    rows.push({ i: n, x: b, fx: fb });
    return { I: (h / 3) * sum, h, rows };
  } catch (e) { return { error: String(e) }; }
}

export default compositeSimpson;
