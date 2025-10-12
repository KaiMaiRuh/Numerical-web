export function gaussJordan(A, b) {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    if (Math.abs(M[i][i]) < 1e-12) return { error: "Pivot = 0 (ควรใช้ Partial Pivoting)" };

    const pivot = M[i][i];
    for (let j = 0; j <= n; j++) M[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = M[k][i];
      for (let j = 0; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  const x = M.map((row) => row[n]);
  return { solution: x, matrix: M };
}

export default gaussJordan;
