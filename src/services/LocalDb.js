// Simple localStorage-based DB adapter for saved problems
// Provides async functions used by services. Stores collections under localStorage keys prefixed with 'numerical_db::'
const PREFIX = 'numerical_db::';

function collectionKey(col) {
  return `${PREFIX}${col}`;
}

function readCol(col) {
  const raw = localStorage.getItem(collectionKey(col));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('LocalDb: failed to parse', e);
    return [];
  }
}

function writeCol(col, arr) {
  localStorage.setItem(collectionKey(col), JSON.stringify(arr));
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export async function list(col) {
  // return items ordered by createdAt desc
  const arr = readCol(col);
  return arr.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function add(col, item) {
  const arr = readCol(col);
  const id = generateId();
  const newItem = { id, ...item };
  if (!newItem.createdAt) newItem.createdAt = Date.now();
  arr.push(newItem);
  writeCol(col, arr);
  return newItem;
}

export async function remove(col, id) {
  const arr = readCol(col);
  const idx = arr.findIndex(x => x.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  writeCol(col, arr);
  return true;
}

export function serverTimestamp() {
  return Date.now();
}
