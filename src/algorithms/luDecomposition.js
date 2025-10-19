// LU Decomposition algorithm
// Exports named `luDecomposition` and default
export function luDecomposition(A, b) {
  try {
    const n = A.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let k = i; k < n; k++) {
        let sum = 0; for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
        U[i][k] = A[i][k] - sum;
      }
      for (let k = i; k < n; k++) {
        if (i === k) L[i][i] = 1; else {
          let sum = 0; for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
          if (Math.abs(U[i][i]) < 1e-12) return { error: "Pivot = 0 (ไม่สามารถแยก LU ได้)" };
          L[k][i] = (A[k][i] - sum) / U[i][i];
        }
      }
    }

    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) { let sum = 0; for (let j = 0; j < i; j++) sum += L[i][j] * y[j]; y[i] = b[i] - sum; }

    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { let sum = 0; for (let j = i + 1; j < n; j++) sum += U[i][j] * x[j]; if (Math.abs(U[i][i]) < 1e-12) return { error: "Pivot = 0 (หารไม่ได้)" }; x[i] = (y[i] - sum) / U[i][i]; }

    return { L, U, solution: x };
  } catch (e) { return { error: String(e) }; }
}

export default luDecomposition;
