import db from "../database/database.js";

function tokenize(text = "") {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);
}

function scoreTextMatch(text, tokens) {
  if (!text) return 0;

  const lower = text.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (lower.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function scoreProduct(product, tokens) {
  let score = 0;

  score += scoreTextMatch(product.title, tokens) * 5;
  score += scoreTextMatch(product.tags, tokens) * 3;
  score += scoreTextMatch(product.vendor, tokens) * 2;
  score += scoreTextMatch(product.product_type, tokens) * 2;

  return score;
}

export function semanticSearch(query, limit = 50) {
  const tokens = tokenize(query);

  const stmt = db.prepare(`
    SELECT
      id,
      title,
      handle,
      vendor,
      product_type,
      price,
      sku,
      tags
    FROM products
  `);

  const products = stmt.all();

  const scored = products
    .map(p => ({
      ...p,
      score: scoreProduct(p, tokens)
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

export default {
  semanticSearch
};
