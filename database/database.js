import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/*
Database path
*/
const DB_PATH = path.join(process.cwd(), "nde.db");

/*
Ensure database file exists
*/
if (!fs.existsSync(DB_PATH)) {
  console.log("Creating new SQLite database...");
}

const db = new Database(DB_PATH);

/*
Performance optimizations
*/
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("temp_store = MEMORY");
db.pragma("cache_size = 1000000");

/*
Products table
*/
db.exec(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT,
    handle TEXT
);
`);

/*
Full Text Search table
*/
db.exec(`
CREATE VIRTUAL TABLE IF NOT EXISTS products_fts
USING fts5(
    title,
    handle,
    content='products',
    content_rowid='id'
);
`);

/*
FTS triggers for automatic sync
*/
db.exec(`

CREATE TRIGGER IF NOT EXISTS products_ai
AFTER INSERT ON products
BEGIN
  INSERT INTO products_fts(rowid, title, handle)
  VALUES (new.id, new.title, new.handle);
END;

CREATE TRIGGER IF NOT EXISTS products_ad
AFTER DELETE ON products
BEGIN
  INSERT INTO products_fts(products_fts, rowid, title, handle)
  VALUES('delete', old.id, old.title, old.handle);
END;

CREATE TRIGGER IF NOT EXISTS products_au
AFTER UPDATE ON products
BEGIN
  INSERT INTO products_fts(products_fts, rowid, title, handle)
  VALUES('delete', old.id, old.title, old.handle);

  INSERT INTO products_fts(rowid, title, handle)
  VALUES (new.id, new.title, new.handle);
END;

`);

console.log("SQLite database initialized.");

export default db;
