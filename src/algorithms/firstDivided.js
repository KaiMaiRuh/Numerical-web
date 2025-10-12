export function firstDividedDiff(x0, x1, fx0, fx1, x) {
  const f01 = (fx1 - fx0) / (x1 - x0);
  const Px = fx0 + f01 * (x - x0);
  return { f01, Px };
}

export default firstDividedDiff;
