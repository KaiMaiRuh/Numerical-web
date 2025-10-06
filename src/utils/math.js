export function formatNum(x) {
  if (x === null || Number.isNaN(x)) return "-";
  if (!isFinite(x)) return String(x);
  return Number(x).toPrecision(8).replace(/(?:\.0+$)|(?:(?<=\.[0-9]*[1-9])0+$)/, "");
}

export function makeFunc(expr) {
  if (!expr || !expr.trim()) return null;
  let s = expr.replace(/\^/g, "**");
  s = s.replace(/\bln\s*\(/gi, "log(");
  s = s.replace(/\bpi\b/gi, "PI");
  s = s.replace(/\be\b/gi, "E");
  try {
    return new Function("x", "with(Math){ return (" + s + "); }");
  } catch {
    return null;
  }
}
