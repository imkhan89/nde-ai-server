import db from "../database/database.js";

function scoreProduct(product, queryParts = [], brand = null) {
  let score = 0;

  const title = (product.title || "").toLowerCase();
  const tags = (product.tags || "").toLowerCase();
  const vendor = (product.vendor || "").toLowerCase();

  // part match scoring
  for (const part of queryParts) {
    if (title.includes(part)) score += 10;
    if (tags.includes(part)) score += 5;
  }

  // brand boost
  if (brand && vendor.includes(brand.toLowerCase())) {
    score += 8;
  }

  // sku bonus
  if (product.sku) {
    score += 1;
  }

  return score;
}

export function optimizeRelevance(products = [], context = {}) {
  const { parts = [], brand = null } = context;

  const scored = products.map((p) => ({
    ...p,
    score: scoreProduct(p, parts, brand)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored;
}

export function getTopRanked(products = [], limit = 20) {
  return products.slice(0, limit);
}

export default {
  optimizeRelevance,
  getTopRanked
};
