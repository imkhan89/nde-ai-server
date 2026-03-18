import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

// ✅ CACHE
let CACHE = [];
let LAST = 0;

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

// ✅ FETCH PRODUCTS
async function fetchProducts() {
  const now = Date.now();

  if (CACHE.length && now - LAST < 600000) {
    return CACHE;
  }

  const res = await axios.get(
    `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=100`,
    {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
    }
  );

  CACHE = res.data.products || [];
  LAST = now;

  return CACHE;
}

// ✅ STRICT MATCH (PRIMARY ENGINE)
function strictSearch(products, tokens) {
  return products.filter((p) => {
    const text = normalize(p.title + " " + (p.tags || ""));

    // ✅ ALL WORDS MUST MATCH (KEY FIX)
    return tokens.every((t) => text.includes(t));
  });
}

// ✅ PART DICTIONARY (FALLBACK)
const DICTIONARY = {
  brake: ["brake", "pad", "pads", "disc", "rotor", "shoe"],
  filter: ["filter", "air", "oil", "cabin"],
};

// ✅ EXPAND QUERY (SECONDARY AI)
function expandTokens(tokens) {
  let expanded = [...tokens];

  tokens.forEach((t) => {
    Object.values(DICTIONARY).forEach((group) => {
      if (group.includes(t)) {
        expanded.push(...group);
      }
    });
  });

  return [...new Set(expanded)];
}

// ✅ PART FILTER
function detectPart(tokens) {
  for (const [part, words] of Object.entries(DICTIONARY)) {
    if (tokens.some((t) => words.includes(t))) {
      return words;
    }
  }
  return null;
}

// ✅ SCORE (SECONDARY)
function score(p, tokens) {
  const text = normalize(p.title + " " + (p.tags || ""));
  let s = 0;

  tokens.forEach((t) => {
    if (text.includes(t)) s += 10;
  });

  return s;
}

// ✅ MAIN SEARCH
export async function searchProducts(query) {
  try {
    const products = await fetchProducts();

    const tokens = tokenize(query);

    if (!tokens.length) return [];

    // 🟢 STEP 1: STRICT MATCH
    let results = strictSearch(products, tokens);

    // 🟡 STEP 2: IF NOTHING → AI FALLBACK
    if (!results.length) {
      const expanded = expandTokens(tokens);
      const partWords = detectPart(tokens);

      const scored = products
        .map((p) => {
          const text = normalize(p.title + " " + (p.tags || ""));

          // 🚨 FILTER BY PART
          if (partWords) {
            const match = partWords.some((w) => text.includes(w));
            if (!match) return null;
          }

          return {
            product: p,
            score: score(p, expanded),
          };
        })
        .filter((x) => x && x.score > 0);

      scored.sort((a, b) => b.score - a.score);

      results = scored.map((x) => x.product);
    }

    // ✅ FINAL FORMAT
    return results.slice(0, 5).map((p) => ({
      title: p.title,
      price: p.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${p.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
