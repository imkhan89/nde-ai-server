import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function initDB() {

const db = await open({
filename: "./nde.db",
driver: sqlite3.Database
})

await db.exec(`

CREATE TABLE IF NOT EXISTS customers(
id INTEGER PRIMARY KEY AUTOINCREMENT,
phone TEXT,
country TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations(
id INTEGER PRIMARY KEY AUTOINCREMENT,
phone TEXT,
message TEXT,
direction TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads(
id INTEGER PRIMARY KEY AUTOINCREMENT,
phone TEXT,
query TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products(
id INTEGER PRIMARY KEY,
title TEXT,
price REAL,
sku TEXT,
handle TEXT
);

CREATE TABLE IF NOT EXISTS orders(
id INTEGER PRIMARY KEY AUTOINCREMENT,
phone TEXT,
order_id TEXT,
status TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints(
id INTEGER PRIMARY KEY AUTOINCREMENT,
phone TEXT,
message TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

`)

return db
}
