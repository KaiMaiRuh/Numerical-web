export function gaussianElimination(A, b) {
  try {
    const n = A.length;
    const M = A.map((row) => [...row]);
    const B = [...b];
    for (let k = 0; k < n - 1; k++) {
      if (Math.abs(M[k][k]) < 1e-12) return { error: "Pivot = 0 (ควรใช้ Partial Pivoting)" };
      for (let i = k + 1; i < n; i++) {
        const m = M[i][k] / M[k][k];
        for (let j = k; j < n; j++) M[i][j] -= m * M[k][j];
        B[i] -= m * B[k];
      }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = 0; for (let j = i + 1; j < n; j++) s += M[i][j] * x[j];
      if (Math.abs(M[i][i]) < 1e-12) return { error: "Pivot = 0 ทำให้หารไม่ได้" };
      x[i] = (B[i] - s) / M[i][i];
    }
    return { solution: x };
  } catch (e) { return { error: String(e) }; }
}

export default gaussianElimination;
