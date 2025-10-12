import { formatNum } from "../utils/math";

export function determinant(matrix) {
  const n = matrix.length;
  if (n === 0) return 0;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let i = 0; i < n; i++) {
    const subMatrix = matrix.slice(1).map((row) => row.filter((_, j) => j !== i));
    det += matrix[0][i] * determinant(subMatrix) * (i % 2 === 0 ? 1 : -1);
  }
  return det;
}

export function cramer(A, b) {
  try {
    if (!Array.isArray(A) || !Array.isArray(b)) return { error: "Invalid input" };
    const n = A.length;
    if (n === 0) return { error: "Empty matrix" };
    const detA = determinant(A);
    if (!isFinite(detA)) return { error: "Determinant not finite" };
    if (Math.abs(detA) < 1e-12) return { error: "Determinant = 0 (ไม่มีคำตอบหรือมีหลายคำตอบ)" };

    const results = [];
    for (let i = 0; i < n; i++) {
      const Ai = A.map((row, r) => row.map((val, c) => (c === i ? b[r] : val)));
      results.push(determinant(Ai) / detA);
    }
    return { detA, results };
  } catch (e) {
    return { error: String(e) };
  }
}

export default cramer;
