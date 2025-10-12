import { factorial } from "mathjs";

export function backwardDiffTable(y) {
  const n = y.length;
  const table = [y.slice()];
  for (let i = 1; i < n; i++) {
    const prev = table[i - 1];
    const diff = [];
    for (let j = 1; j < prev.length; j++) {
      diff.push(prev[j] - prev[j - 1]);
    }
    table.push(diff);
  }
  return table;
}

export function newtonBackward(xVals, yVals, x) {
  const n = xVals.length;
  if (n === 0) return { error: "Empty input" };
  const h = xVals[1] - xVals[0];
  const table = backwardDiffTable(yVals);
  const u = (x - xVals[n - 1]) / h;

  let sum = yVals[n - 1];
  for (let i = 1; i < n; i++) {
    let term = table[i][table[i].length - 1];
    for (let j = 0; j < i; j++) {
      term *= (u + j);
    }
    sum += term / factorial(i);
  }
  return { result: sum, table };
}

export default newtonBackward;
