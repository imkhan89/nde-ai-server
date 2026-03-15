import db from "../database/database.js";

export async function logSearch({ query, normalized_query }) {
  if (!query) return;

  const stmt = db.prepare(`
    INSERT INTO search_logs
    (query, normalized_query, created_at)
    VALUES (?, ?, ?)
  `);

  stmt.run(
    query,
    normalized_query || "",
    new Date().toISOString()
  );
}

export async function getRecentSearches(limit = 50) {
  const stmt = db.prepare(`
    SELECT query, normalized_query, created_at
    FROM search_logs
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export default {
  logSearch,
  getRecentSearches
};
