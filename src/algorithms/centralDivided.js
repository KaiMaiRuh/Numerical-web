import { factorial } from "mathjs";

export function centralDiffTable(y) {
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

export function newtonCentral(xVals, yVals, x) {
  const n = xVals.length;
  if (n < 3) throw new Error("ต้องมีข้อมูลอย่างน้อย 3 จุด");

  const h = xVals[1] - xVals[0];
  const m = Math.floor(n / 2);
  const u = (x - xVals[m]) / h;

  const table = centralDiffTable(yVals);

  let sum = yVals[m];

  for (let i = 1; i < n && i < 6; i++) {
    if (i % 2 !== 0) {
      const idx = Math.floor(i / 2);
      let term = u;
      for (let j = 1; j < i; j++) term *= (u * u - (j * j)) / (2 * j + 1);
      term *= table[i][m - idx];
      sum += term / factorial(i);
    } else {
      const idx = i / 2;
      let term = 1;
      for (let j = 0; j < idx; j++) term *= (u * u - j * j);
      term *= table[i][m - idx];
      sum += term / factorial(i);
    }
  }

  return { result: sum, table, u, h, m };
}

export default newtonCentral;
