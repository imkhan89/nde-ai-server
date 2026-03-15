import db from "../database/database.js";

function updateSearchLearning() {
  const stmt = db.prepare(`
    SELECT normalized_query, COUNT(*) as total
    FROM search_logs
    GROUP BY normalized_query
    ORDER BY total DESC
    LIMIT 100
  `);

  return stmt.all();
}

function detectTrendingSearches(limit = 20) {
  const stmt = db.prepare(`
    SELECT query, COUNT(*) as total
    FROM search_logs
    WHERE created_at >= datetime('now','-7 days')
    GROUP BY query
    ORDER BY total DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

function learnPopularParts(limit = 20) {
  const stmt = db.prepare(`
    SELECT tags, COUNT(*) as total
    FROM products
    GROUP BY tags
    ORDER BY total DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export {
  updateSearchLearning,
  detectTrendingSearches,
  learnPopularParts
};

export default {
  updateSearchLearning,
  detectTrendingSearches,
  learnPopularParts
};
