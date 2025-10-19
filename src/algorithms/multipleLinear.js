// Multiple linear regression helpers and solver
// Exports named helpers and default fitMultipleLinear

export function gaussianSolve(A, b) {
  const n = A.length;
  const M = A.map((row) => row.slice());
  const v = b.slice();

  for (let k = 0; k < n; k++) {
    let iMax = k;
    let maxVal = Math.abs(M[k][k]);
    for (let i = k + 1; i < n; i++) {
      const val = Math.abs(M[i][k]);
      if (val > maxVal) {
        maxVal = val;
        iMax = i;
      }
    }
    if (maxVal < 1e-15) throw new Error("Matrix is singular or ill-conditioned.");

    if (iMax !== k) {
      [M[k], M[iMax]] = [M[iMax], M[k]];
      [v[k], v[iMax]] = [v[iMax], v[k]];
    }

    for (let i = k + 1; i < n; i++) {
      const f = M[i][k] / M[k][k];
      M[i][k] = 0;
      for (let j = k + 1; j < n; j++) M[i][j] -= f * M[k][j];
      v[i] -= f * v[k];
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = v[i];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

export function transpose(M) {
  const r = M.length, c = M[0].length;
  const T = Array.from({ length: c }, () => Array(r).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = M[i][j];
  return T;
}

export function matMul(A, B) {
  const r = A.length, k = A[0].length, c = B[0].length;
  const R = Array.from({ length: r }, () => Array(c).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
      R[i][j] = s;
    }
  }
  return R;
}

export default function fitMultipleLinear(dataRows) {
  try {
    const n = dataRows.length; if (n < 2) return { error: "ต้องมีข้อมูลอย่างน้อย 2 แถว" };
    const X = dataRows.map((r) => [1, ...r.x]);
    const y = dataRows.map((r) => [r.y]);
    const Xt = transpose(X), XtX = matMul(Xt, X), Xty = matMul(Xt, y).map((row) => row[0]);
    const w = gaussianSolve(XtX, Xty);
    const yHat = X.map((row) => row.reduce((s, val, i) => s + val * w[i], 0));
    const yArr = y.map((r) => r[0]);
    const yMean = yArr.reduce((s, v) => s + v, 0) / n;
    const ssTot = yArr.reduce((s, v) => s + (v - yMean) ** 2, 0);
    const ssRes = yArr.reduce((s, v, i) => s + (v - yHat[i]) ** 2, 0);
    return { coef: w, r2: ssTot > 0 ? 1 - ssRes / ssTot : 1, yHat };
  } catch (e) { return { error: String(e) }; }
}

export function predict(w, xVec) {
  return w[0] + xVec.reduce((s, v, i) => s + w[i + 1] * v, 0);
}
