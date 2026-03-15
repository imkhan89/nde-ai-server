import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let DatabaseDriver = null;
let db = null;

/*
AUTO-OPTIMIZING DATABASE LOADER
Attempts to load better-sqlite3.
If not installed, automatically falls back to sqlite3.
Prevents container crash.
*/

async function loadDriver() {

  try {

    const module = await import("better-sqlite3");
    DatabaseDriver = module.default;

    return "better-sqlite3";

  } catch (err) {

    const module = await import("sqlite3");
    DatabaseDriver = module.default;

    return "sqlite3";

  }

}

async function initializeDatabase() {

  const driver = await loadDriver();

  const dataDir = path.join(__dirname, "..", "data");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "nde_ai.db");

  if (driver === "better-sqlite3") {

    db = new DatabaseDriver(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        sku TEXT,
        brand TEXT,
        vehicle_make TEXT,
        vehicle_model TEXT,
        vehicle_year TEXT,
        category TEXT,
        price REAL,
        data JSON
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS learning_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  } else {

    db = new DatabaseDriver.Database(dbPath);

    db.serialize(() => {

      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          sku TEXT,
          brand TEXT,
          vehicle_make TEXT,
          vehicle_model TEXT,
          vehicle_year TEXT,
          category TEXT,
          price REAL,
          data TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS learning_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          query TEXT,
          result TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

    });

  }

  return db;

}

export async function getDatabase() {

  if (!db) {
    db = await initializeDatabase();
  }

  return db;

}

/*
AI SELF LEARNING STORAGE
*/

export async function logLearning(query, result) {

  const database = await getDatabase();

  if (database.exec) {

    const stmt = database.prepare(`
      INSERT INTO learning_log (query, result)
      VALUES (?, ?)
    `);

    stmt.run(query, JSON.stringify(result));

  } else {

    database.run(
      `INSERT INTO learning_log (query, result) VALUES (?, ?)`,
      [query, JSON.stringify(result)]
    );

  }

}
