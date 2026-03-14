import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function initDatabase() {

    if (db) {
        return db;
    }

    try {

        db = await open({
            filename: "./nde.db",
            driver: sqlite3.Database
        });

        // Improve performance
        await db.exec(`
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
            PRAGMA temp_store = MEMORY;
        `);

        // Create main product table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                handle TEXT NOT NULL
            );
        `);

        // Create FTS5 table for semantic search
        await db.exec(`
            CREATE VIRTUAL TABLE IF NOT EXISTS products_fts
            USING fts5(
                title,
                handle,
                content='products',
                content_rowid='id'
            );
        `);

        // Rebuild FTS index to ensure sync
        await rebuildFTSIndex();

        console.log("Database initialized successfully");

        return db;

    } catch (error) {

        console.error("Database initialization error:", error);
        throw error;

    }

}

export function getDatabase() {

    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }

    return db;

}

export async function rebuildFTSIndex() {

    try {

        if (!db) return;

        // Clear existing index
        await db.exec(`
            DELETE FROM products_fts;
        `);

        // Rebuild index from products table
        await db.exec(`
            INSERT INTO products_fts(rowid, title, handle)
            SELECT id, title, handle FROM products;
        `);

        console.log("FTS index rebuilt successfully");

    } catch (error) {

        console.error("FTS rebuild error:", error);

    }

}
