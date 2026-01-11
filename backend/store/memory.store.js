// Simple in-memory key-value store
export const db = {};

export function get(key) {
  return db[key];
}

export function set(key, value) {
  db[key] = value;
  return { key, value };
}

export function deleteKey(key) {
  if (db[key] === undefined) return false;
  delete db[key];
  return true;
}

export function has(key) {
  return db[key] !== undefined;
}

export function all() {
  return { ...db };
}

export function clear() {
  Object.keys(db).forEach((k) => delete db[k]);
}

export default { get, set, deleteKey, has, all, clear };

