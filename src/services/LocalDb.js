const PREFIX = 'numerical_db::';
const key = (c) => PREFIX + c;
const read = (c) => {
  try { return JSON.parse(localStorage.getItem(key(c)) || '[]'); }
  catch { return []; }
};
const write = (c, a) => localStorage.setItem(key(c), JSON.stringify(a));
const genId = () => Math.random().toString(36).slice(2, 9);

export const list = async (c) => read(c).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
export const add = async (c, item) => {
  const arr = read(c);
  const newItem = { id: genId(), ...item };
  if (!newItem.createdAt) newItem.createdAt = Date.now();
  arr.push(newItem);
  write(c, arr);
  return newItem;
};
export const remove = async (c, id) => {
  const arr = read(c);
  const i = arr.findIndex((x) => x.id === id);
  if (i < 0) return false;
  arr.splice(i, 1);
  write(c, arr);
  return true;
};
export const serverTimestamp = () => Date.now();
