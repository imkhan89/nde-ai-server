import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDatabase() {

    const db = await open({
        filename: "./nde.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            title TEXT,
            handle TEXT
        );
    `);

    await db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS products_fts
        USING fts5(title, handle, content='products', content_rowid='id');
    `);

    return db;
}
