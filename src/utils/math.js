export function formatNum(x, sig = 6) {
  // Returns a human-friendly numeric string. Default: 6 significant digits.
  if (x === null || Number.isNaN(x)) return "-";
  if (!isFinite(x)) return String(x);
  // Use Number(toPrecision) then strip trailing zeros where appropriate
  return Number(x).toPrecision(sig).replace(/(?:\.0+$)|(?:(?<=\.[0-9]*[1-9])0+$)/, "");
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
