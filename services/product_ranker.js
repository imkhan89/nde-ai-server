const BRAND_PRIORITY = [
  "denso",
  "bosch",
  "ngk",
  "nwb"
];

function getBrandScore(title) {
  const t = title.toLowerCase();

  for (let i = 0; i < BRAND_PRIORITY.length; i++) {
    if (t.includes(BRAND_PRIORITY[i])) {
      return BRAND_PRIORITY.length - i;
    }
  }

  return 0;
}

function keywordScore(title, queryTokens) {
  const t = title.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (t.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function rankProducts(products, query) {

  if (!products || products.length === 0) {
    return [];
  }

  const normalized = normalizeQuery(query);
  const tokens = normalized.split(" ").filter(t => t.length > 2);

  const ranked = products.map(product => {

    const brandScore = getBrandScore(product.title);
    const kwScore = keywordScore(product.title, tokens);

    const finalScore =
      brandScore * 5 +
      kwScore * 2;

    return {
      ...product,
      score: finalScore
    };

  });

  ranked.sort((a, b) => b.score - a.score);

  return ranked;
}
