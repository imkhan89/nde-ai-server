import db from "../database/database.js";

/*
Normalize search query
*/
function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
Generate search tokens
*/
function generateSearchTokens(query) {
  const tokens = query.split(" ");

  /*
  Remove short useless tokens
  */
  return tokens.filter(token => token.length > 2);
}

/*
Build FTS query
*/
function buildFTSQuery(tokens) {

  /*
  Convert tokens into FTS MATCH query
  Example:
  corolla wiper -> corolla* AND wiper*
  */

  const terms = tokens.map(t => `${t}*`);

  return terms.join(" AND ");
}

/*
Main semantic search function
*/
export function semanticProductSearch(query, limit = 10) {

  try {

    const normalized = normalizeQuery(query);

    const tokens = generateSearchTokens(normalized);

    if (tokens.length === 0) {
      return [];
    }

    const ftsQuery = buildFTSQuery(tokens);

    const stmt = db.prepare(`
      SELECT
        p.id,
        p.title,
        p.handle,
        rank
      FROM products_fts
      JOIN products p ON p.id = products_fts.rowid
      WHERE products_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `);

    const results = stmt.all(ftsQuery, limit);

    return results;

  } catch (error) {

    console.error("Semantic product search error:", error.message);

    return [];

  }
}
