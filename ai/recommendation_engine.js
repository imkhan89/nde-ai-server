import db from "../database/database.js";

function tokenize(text = "") {
  return text
    .toLowerCase()
    .split(/[\s,]+/)
    .map(t => t.trim())
    .filter(Boolean);
}

function scoreSimilarity(baseTags = "", targetTags = "") {
  const baseTokens = tokenize(baseTags);
  const targetTokens = tokenize(targetTags);

  let score = 0;

  for (const token of baseTokens) {
    if (targetTokens.includes(token)) {
      score += 1;
    }
  }

  return score;
}

export function recommendProducts(productId, limit = 10) {
  const baseStmt = db.prepare(`
    SELECT *
    FROM products
    WHERE id = ?
  `);

  const baseProduct = baseStmt.get(productId);

  if (!baseProduct) return [];

  const stmt = db.prepare(`
    SELECT *
    FROM products
    WHERE id != ?
  `);

  const products = stmt.all(productId);

  const scored = products
    .map(p => ({
      ...p,
      score: scoreSimilarity(baseProduct.tags, p.tags)
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

export default {
  recommendProducts
};
