export function gaussJordan(A, b) {
  try {
    const n = A.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < n; i++) {
      if (Math.abs(M[i][i]) < 1e-12) return { error: "Pivot = 0 (ควรใช้ Partial Pivoting)" };
      const p = M[i][i];
      for (let j = 0; j <= n; j++) M[i][j] /= p;
      for (let k = 0; k < n; k++) if (k !== i) {
        const f = M[k][i];
        for (let j = 0; j <= n; j++) M[k][j] -= f * M[i][j];
      }
    }
    const x = M.map((row) => row[n]);
    return { solution: x, matrix: M };
  } catch (e) { return { error: String(e) }; }
}

export default gaussJordan;
