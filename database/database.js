// database/database.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function initDatabase() {

    if (db) {
        return db;
    }

    db = await open({
        filename: "./nde.db",
        driver: sqlite3.Database
    });

    // Performance settings
    await db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA temp_store = MEMORY;
    `);

    // Main products table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            handle TEXT NOT NULL
        );
    `);

    // FTS5 semantic search table
    await db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS products_fts
        USING fts5(
            title,
            handle,
            content='products',
            content_rowid='id'
        );
    `);

    // Rebuild FTS index if needed
    await rebuildFTSIndex();

    console.log("Database initialized");

    return db;
}

export function getDatabase() {

    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }

    return db;
}

export async function rebuildFTSIndex() {

    if (!db) return;

    try {

        await db.exec(`
            DELETE FROM products_fts;
        `);

        await db.exec(`
            INSERT INTO products_fts(rowid, title, handle)
            SELECT id, title, handle FROM products;
        `);

        console.log("FTS index rebuilt");

    } catch (error) {

        console.error("FTS rebuild error:", error);

    }

}
