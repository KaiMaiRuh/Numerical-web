// Tiny shared helpers for graph components to keep code consistent and short
export const niceStep = (range) => {
  const r = Math.max(range || 0, 1e-9);
  const rough = Math.pow(10, Math.floor(Math.log10(r)));
  const v = r / rough;
  return v < 1.5 ? rough * 0.1 : v < 3 ? rough * 0.2 : v < 7 ? rough * 0.5 : rough;
};

export default { niceStep };
