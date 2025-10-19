export function determinant(M) {
  const n = M.length;
  if (n === 0) return 0;
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  let det = 0;
  for (let i = 0; i < n; i++) {
    const sub = M.slice(1).map((row) => row.filter((_, j) => j !== i));
    det += M[0][i] * determinant(sub) * (i % 2 === 0 ? 1 : -1);
  }
  return det;
}

export function cramer(A, b) {
  try {
    if (!Array.isArray(A) || !Array.isArray(b)) return { error: "Invalid input" };
    const n = A.length;
    if (!n) return { error: "Empty matrix" };
    if (!A.every((row) => Array.isArray(row) && row.length === n)) return { error: "A must be square" };
    if (b.length !== n) return { error: "b length must equal A size" };

    const detA = determinant(A);
    if (Math.abs(detA) < 1e-12) return { error: "Determinant = 0 (ไม่มีคำตอบหรือมีหลายคำตอบ)" };

    const results = Array.from({ length: n }, (_, i) =>
      determinant(A.map((row, r) => row.map((v, c) => (c === i ? b[r] : v)))) / detA
    );
    return { detA, results, solution: results };
  } catch (e) {
    return { error: String(e) };
  }
}

export default cramer;
