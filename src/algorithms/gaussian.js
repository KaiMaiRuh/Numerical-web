export function gaussianElimination(A, b) {
  const n = A.length;
  const M = A.map((row) => [...row]);
  const B = [...b];

  // Forward elimination
  for (let k = 0; k < n - 1; k++) {
    if (Math.abs(M[k][k]) < 1e-12) return { error: "Pivot = 0 (ควรใช้ Partial Pivoting)" };
    for (let i = k + 1; i < n; i++) {
      const m = M[i][k] / M[k][k];
      for (let j = k; j < n; j++) {
        M[i][j] -= m * M[k][j];
      }
      B[i] -= m * B[k];
    }
  }

  // Back substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) sum += M[i][j] * x[j];
    if (Math.abs(M[i][i]) < 1e-12) return { error: "Pivot = 0 ทำให้หารไม่ได้" };
    x[i] = (B[i] - sum) / M[i][i];
  }

  return { solution: x };
}

export default gaussianElimination;
