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

  // Insert implicit multiplication where appropriate:
  // - between a number and x / PI / E or '('
  // - between x/PI/E and '('
  // - between ')' and '(', number, or variable
  try {
    // number followed by x or PI/E
    s = s.replace(/(\d(?:\.\d+)?)(\s*)(?=(x|X|PI|pi|E|e)\b)/g, "$1*");
    // number followed by (
    s = s.replace(/(\d(?:\.\d+)?)(\s*)(?=\()/g, "$1*");
    // x followed by number or (
    s = s.replace(/(x|X)\s*(?=\d|\()/g, "$1*");
    // PI/E/variable followed by (
    s = s.replace(/(PI|pi|E|e)\s*(?=\()/g, "$1*");
    // ) followed by ( or x or number or PI/E
    s = s.replace(/\)\s*(?=\(|x|X|\d|PI|pi|E|e)/g, ")*");
  } catch (e) {
    // if regex fails for any reason, keep original s
  }

  try {
    return new Function("x", "with(Math){ return (" + s + "); }");
  } catch (err) {
    return null;
  }
}
