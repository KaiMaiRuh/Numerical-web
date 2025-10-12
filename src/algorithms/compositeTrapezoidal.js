export function compositeTrapezoidal(a, b, n, f) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  const rows = [{ i: 0, x: a, fx: f(a) }];

  for (let i = 1; i < n; i++) {
    const xi = a + i * h;
    sum += 2 * f(xi);
    rows.push({ i, x: xi, fx: f(xi) });
  }

  rows.push({ i: n, x: b, fx: f(b) });
  const I = (h / 2) * sum;
  return { I, h, rows };
}

export default compositeTrapezoidal;
