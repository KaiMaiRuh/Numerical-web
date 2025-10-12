export function choleskyDecomposition(A, b) {
  const n = A.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));

  try {
    // Step 1: Find L
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];

        if (i === j) {
          const val = A[i][i] - sum;
          if (val <= 0) return { error: "A ไม่เป็นบวกกำหนดแน่นอน (Positive Definite)" };
          L[i][j] = Math.sqrt(val);
        } else {
          L[i][j] = (A[i][j] - sum) / L[j][j];
        }
      }
    }

    // Step 2: Solve L*y = b (Forward Substitution)
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[i][j] * y[j];
      y[i] = (b[i] - sum) / L[i][i];
    }

    // Step 3: Solve Lᵀ*x = y (Backward Substitution)
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) sum += L[j][i] * x[j];
      x[i] = (y[i] - sum) / L[i][i];
    }

    return { L, solution: x };
  } catch (e) {
    return { error: "เกิดข้อผิดพลาดในการคำนวณ" };
  }
}

export default choleskyDecomposition;
