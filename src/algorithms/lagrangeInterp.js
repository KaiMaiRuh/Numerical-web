// Lagrange interpolation algorithm
// Exports a named `lagrange` function and a default export for compatibility
export function lagrange(xs, ys, x) {
  const n = xs.length;
  let fx = 0;
  let detail = [];

  for (let i = 0; i < n; i++) {
    let Li = 1;
    let LiStr = `L${i}(x) = `;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        Li *= (x - xs[j]) / (xs[i] - xs[j]);
        LiStr += `((x - ${xs[j]})/(${xs[i]} - ${xs[j]})) `;
      }
    }
    const term = ys[i] * Li;
    fx += term;
    detail.push({ i, Li, term, LiStr });
  }
  return { fx, detail };
}

export default lagrange;
