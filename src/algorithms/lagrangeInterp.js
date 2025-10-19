// Lagrange interpolation algorithm
// Exports a named `lagrange` function and a default export for compatibility
export function lagrange(xs, ys, x) {
  try {
    const n = xs.length; let fx = 0; const detail = [];
    for (let i = 0; i < n; i++) {
      let Li = 1, LiStr = `L${i}(x) = `;
      for (let j = 0; j < n; j++) if (i !== j) { Li *= (x - xs[j]) / (xs[i] - xs[j]); LiStr += `((x - ${xs[j]})/(${xs[i]} - ${xs[j]})) `; }
      const term = ys[i] * Li; fx += term; detail.push({ i, Li, term, LiStr });
    }
    return { fx, detail };
  } catch (e) { return { error: String(e) }; }
}

export default lagrange;
