import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.resolve("./data");
const DB_PATH = path.join(DB_DIR, "nde_ai.db");

// ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// initialize database
const db = new Database(DB_PATH);

// performance pragmas
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("cache_size = 10000");

// products table
db.prepare(`
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT,
    handle TEXT,
    vendor TEXT,
    product_type TEXT,
    price REAL,
    sku TEXT,
    tags TEXT,
    created_at TEXT,
    updated_at TEXT
)
`).run();

// vehicles table
db.prepare(`
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT,
    model TEXT,
    year INTEGER
)
`).run();

// parts table
db.prepare(`
CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_name TEXT,
    synonyms TEXT
)
`).run();

// brands table
db.prepare(`
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT
)
`).run();

// search logs
db.prepare(`
CREATE TABLE IF NOT EXISTS search_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT,
    normalized_query TEXT,
    created_at TEXT
)
`).run();

// compatibility graph
db.prepare(`
CREATE TABLE IF NOT EXISTS compatibility (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_make TEXT,
    vehicle_model TEXT,
    vehicle_year INTEGER,
    part_name TEXT,
    brand_name TEXT
)
`).run();

export default db;
