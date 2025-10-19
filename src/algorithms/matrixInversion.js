// Matrix inversion helpers and solver using Gauss-Jordan
export function identityMatrix(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

export function invertMatrix(A) {
  try {
    const n = A.length;
    const I = identityMatrix(n);
    const M = A.map((row, i) => [...row, ...I[i]]);
    for (let i = 0; i < n; i++) {
      let pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) return { error: "Pivot = 0 (ไม่สามารถหา Inverse ได้)" };
      for (let j = 0; j < 2 * n; j++) M[i][j] /= pivot;
      for (let k = 0; k < n; k++) {
        if (k === i) continue;
        const factor = M[k][i];
        for (let j = 0; j < 2 * n; j++) M[k][j] -= factor * M[i][j];
      }
    }
    return { inverse: M.map((row) => row.slice(n)) };
  } catch (e) { return { error: String(e) }; }
}

export function multiplyMatrixVector(A, b) {
  const n = A.length;
  const result = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += A[i][j] * b[j];
    }
  }
  return result;
}

export function solveByMatrixInversion(A, b) {
  try {
    const res = invertMatrix(A);
    if (res.error) return { error: res.error };
    return { solution: multiplyMatrixVector(res.inverse, b), inverse: res.inverse };
  } catch (e) { return { error: String(e) }; }
}

export default solveByMatrixInversion;
