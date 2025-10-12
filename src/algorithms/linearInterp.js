// Linear interpolation algorithm
// Exports a named `linearInterpolation` and a default export
export function linearInterpolation(x1, y1, x2, y2, x) {
  // assumes inputs are numbers and x1 != x2
  const fx = y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);
  return fx;
}

export default linearInterpolation;
