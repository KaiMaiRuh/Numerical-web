import { factorial } from "mathjs";

export function forwardDiffTable(y) {
  const n = y.length;
  const table = [y.slice()];
  for (let i = 1; i < n; i++) {
    const prev = table[i - 1];
    const diff = [];
    for (let j = 0; j < prev.length - 1; j++) {
      diff.push(prev[j + 1] - prev[j]);
    }
    table.push(diff);
  }
  return table;
}

export function newtonForward(xVals, yVals, x) {
  const n = xVals.length;
  const h = xVals[1] - xVals[0];
  const table = forwardDiffTable(yVals);
  const u = (x - xVals[0]) / h;

  let sum = yVals[0];
  for (let i = 1; i < n; i++) {
    let term = table[i][0];
    for (let j = 0; j < i; j++) {
      term *= (u - j);
    }
    sum += term / factorial(i);
  }
  return { result: sum, table };
}

export default newtonForward;
