// Polynomial interpolation (Newton's Divided Difference)
export function dividedDifferences(xs, ys) {
  const n = xs.length;
  const table = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) table[i][0] = ys[i];

  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (xs[i + j] - xs[i]);
    }
  }
  return table;
}

export function newtonPolynomial(xs, table, x) {
  const n = xs.length;
  let fx = table[0][0];
  for (let i = 1; i < n; i++) {
    let term = table[0][i];
    for (let j = 0; j < i; j++) term *= (x - xs[j]);
    fx += term;
  }
  return fx;
}

export default function polynomialInterpolation(xs, ys, x) {
  const table = dividedDifferences(xs, ys);
  const fx = newtonPolynomial(xs, table, x);
  return { fx, table };
}
