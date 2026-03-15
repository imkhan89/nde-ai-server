import db from "../database/database.js";

export function getTopSearchQueries(limit = 20) {
  const stmt = db.prepare(`
    SELECT query, COUNT(*) as total
    FROM search_logs
    GROUP BY query
    ORDER BY total DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export function getZeroResultQueries(limit = 20) {
  const stmt = db.prepare(`
    SELECT query, COUNT(*) as total
    FROM search_logs
    WHERE query NOT IN (
      SELECT title FROM products
    )
    GROUP BY query
    ORDER BY total DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export function getPopularBrands(limit = 20) {
  const stmt = db.prepare(`
    SELECT vendor as brand, COUNT(*) as total
    FROM products
    GROUP BY vendor
    ORDER BY total DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export function getPopularProductTypes(limit = 20) {
  const stmt = db.prepare(`
    SELECT product_type, COUNT(*) as total
    FROM products
    GROUP BY product_type
    ORDER BY total DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export default {
  getTopSearchQueries,
  getZeroResultQueries,
  getPopularBrands,
  getPopularProductTypes
};
