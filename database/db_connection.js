import db from "./database.js";

export function getDB() {
  return db;
}

export function run(query, params = []) {
  const stmt = db.prepare(query);
  return stmt.run(params);
}

export function get(query, params = []) {
  const stmt = db.prepare(query);
  return stmt.get(params);
}

export function all(query, params = []) {
  const stmt = db.prepare(query);
  return stmt.all(params);
}

export function transaction(fn) {
  const trx = db.transaction(fn);
  return trx();
}

export default {
  getDB,
  run,
  get,
  all,
  transaction
};
