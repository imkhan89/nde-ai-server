import sqlite3 from "sqlite3"

let db = null

export function initDB() {

  if (!db) {

    db = new sqlite3.Database("nde.db", (err) => {
      if (err) {
        console.error("Database connection error:", err.message)
      } else {
        console.log("SQLite database connected")
      }
    })

    db.serialize(() => {

      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          title TEXT,
          handle TEXT
        )
      `)

      db.run(`
        CREATE VIRTUAL TABLE IF NOT EXISTS products_fts
        USING fts5(title, handle)
      `)

    })

  }

  return db
}

export default initDB()
