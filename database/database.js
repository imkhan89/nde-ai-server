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
  }

  return db
}

export default initDB()
