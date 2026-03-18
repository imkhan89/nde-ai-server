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

// ✅ PART DICTIONARY
const PARTS = {
  brake: ["brake", "pad", "pads", "disc", "rotor", "shoe"],
  filter: ["filter", "air", "oil", "cabin"],
};

// ✅ DETECT PART
function detectPart(tokens) {
  for (const [key, words] of Object.entries(PARTS)) {
    if (tokens.some((t) => words.includes(t))) {
      return words;
    }
  }
  return null;
}

// ✅ SCORE ENGINE (CORE FIX)
function scoreProduct(product, tokens, partWords) {
  const text = normalize(product.title + " " + (product.tags || ""));

  let score = 0;

  // ✅ TOKEN MATCH
  tokens.forEach((t) => {
    if (text.includes(t)) score += 10;
  });

  // ✅ PART MATCH (CRITICAL)
  if (partWords) {
    const match = partWords.some((w) => text.includes(w));

    if (!match) return 0; // ❌ remove wrong category
    score += 50;
  }

  // ✅ MULTI WORD BOOST
  const matches = tokens.filter((t) => text.includes(t)).length;
  if (matches >= 2) score += 30;

  return score;
}

// ✅ MAIN SEARCH
export async function searchProducts(query) {
  try {
    const products = await fetchProducts();

    const tokens = tokenize(query);
    const partWords = detectPart(tokens);

    const scored = products
      .map((p) => ({
        product: p,
        score: scoreProduct(p, tokens, partWords),
      }))
      .filter((x) => x.score > 0);

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 5).map((x) => ({
      title: x.product.title,
      price: x.product.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${x.product.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
