// Polynomial interpolation (Newton's Divided Difference)
export function dividedDifferences(xs, ys) {
  const n = xs.length;
  if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length) {
    throw new Error("xs and ys must be arrays of the same length");
  }
  // check for duplicate x values
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(xs[i] - xs[j]) < 1e-12) throw new Error("Duplicate x values not allowed");
    }
  }
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
  // coefficients are the first row of the divided-difference table
  const coeff = table[0].slice(0, xs.length);
  return { fx, table, coeff };
}
