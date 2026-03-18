import { AI_DICTIONARY, AI_PRODUCT_INDEX } from "./learning_engine.js";

// ✅ EXPAND QUERY USING AI LEARNING
function expandTokens(tokens) {
  let expanded = [...tokens];

  tokens.forEach((t) => {
    if (AI_DICTIONARY[t]) {
      expanded.push(...Array.from(AI_DICTIONARY[t]));
    }
  });

  return [...new Set(expanded)];
}

// ✅ SCORE ENGINE
function score(item, tokens) {
  let score = 0;

  const productTokens = item.tokens;

  tokens.forEach((t) => {
    if (productTokens.includes(t)) score += 20;
  });

  return score;
}

// ✅ SEARCH USING AI INDEX
export function aiSearch(query) {
  const tokens = query
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 1);

  const expanded = expandTokens(tokens);

  const scored = AI_PRODUCT_INDEX
    .map((item) => ({
      item,
      score: score(item, expanded),
    }))
    .filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map((x) => ({
    title: x.item.product.title,
    price: x.item.product.variants?.[0]?.price || "0",
    url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${x.item.product.handle}`,
  }));
}
