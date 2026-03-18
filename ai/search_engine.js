import { AI_DICTIONARY, AI_PRODUCT_INDEX } from "./learning_engine.js";

// ✅ CORE PART DETECTION (AUTO-LEARNED + BASE)
const BASE_PARTS = {
  brake: ["brake", "pad", "pads", "disc", "rotor", "shoe"],
  filter: ["filter", "air", "oil", "cabin"],
  radiator: ["radiator", "cooling"],
  shock: ["shock", "absorber"],
};

// ✅ NORMALIZE
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

// ✅ TOKENIZE
function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 1);
}

// ✅ DETECT INTENT (VERY IMPORTANT)
function detectIntent(tokens) {
  for (const [type, words] of Object.entries(BASE_PARTS)) {
    if (tokens.some((t) => words.includes(t))) {
      return type;
    }
  }
  return null;
}

// ✅ EXPAND USING AI
function expandTokens(tokens) {
  let expanded = [...tokens];

  tokens.forEach((t) => {
    if (AI_DICTIONARY[t]) {
      expanded.push(...Array.from(AI_DICTIONARY[t]));
    }
  });

  return [...new Set(expanded)];
}

// ✅ STRICT FILTER
function isRelevant(productTokens, intent) {
  if (!intent) return true;

  const intentWords = BASE_PARTS[intent];

  return intentWords.some((w) => productTokens.includes(w));
}

// ✅ SCORE
function score(item, tokens, intent) {
  const productTokens = item.tokens;

  // ❌ STRICT FILTER FIRST
  if (!isRelevant(productTokens, intent)) return 0;

  let score = 0;

  tokens.forEach((t) => {
    if (productTokens.includes(t)) score += 20;
  });

  // ✅ BOOST MULTI MATCH
  const matches = tokens.filter((t) =>
    productTokens.includes(t)
  ).length;

  if (matches >= 2) score += 40;

  return score;
}

// ✅ MAIN SEARCH
export function aiSearch(query) {
  const tokens = tokenize(query);

  const intent = detectIntent(tokens);

  const expanded = expandTokens(tokens);

  const scored = AI_PRODUCT_INDEX
    .map((item) => ({
      item,
      score: score(item, expanded, intent),
    }))
    .filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map((x) => ({
    title: x.item.product.title,
    price: x.item.product.variants?.[0]?.price || "0",
    url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${x.item.product.handle}`,
  }));
}
