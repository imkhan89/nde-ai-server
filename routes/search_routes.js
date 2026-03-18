import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

// ✅ MEMORY (SELF LEARNING CACHE)
let PRODUCT_CACHE = [];
let LAST_FETCH = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 min

// ✅ LEARNING DICTIONARY (AUTO EXPANDS)
let LEARNED_TERMS = {};

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

// ✅ AUTO LEARN TERMS FROM PRODUCTS
function learnFromProducts(products) {
  products.forEach((p) => {
    const words = tokenize(p.title + " " + (p.tags || ""));

    words.forEach((w) => {
      if (!LEARNED_TERMS[w]) {
        LEARNED_TERMS[w] = new Set();
      }

      words.forEach((related) => {
        if (w !== related) {
          LEARNED_TERMS[w].add(related);
        }
      });
    });
  });
}

// ✅ EXPAND TOKENS (AI LEARNING)
function expandTokens(tokens) {
  let expanded = [...tokens];

  tokens.forEach((t) => {
    if (LEARNED_TERMS[t]) {
      expanded.push(...Array.from(LEARNED_TERMS[t]));
    }
  });

  return [...new Set(expanded)];
}

// ✅ FETCH ALL PRODUCTS (AUTO SYNC)
async function fetchProducts() {
  try {
    const now = Date.now();

    if (PRODUCT_CACHE.length && now - LAST_FETCH < CACHE_TTL) {
      return PRODUCT_CACHE;
    }

    let allProducts = [];
    let url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`;

    while (url) {
      const response = await axios.get(url, {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
      });

      const products = response.data.products || [];
      allProducts = allProducts.concat(products);

      const link = response.headers.link;

      if (link && link.includes('rel="next"')) {
        const match = link.match(/<([^>]+)>; rel="next"/);
        url = match ? match[1] : null;
      } else {
        url = null;
      }
    }

    PRODUCT_CACHE = allProducts;
    LAST_FETCH = now;

    // ✅ AUTO LEARN FROM DATA
    learnFromProducts(PRODUCT_CACHE);

    console.log(`AI Learned from ${PRODUCT_CACHE.length} products`);

    return PRODUCT_CACHE;

  } catch (error) {
    console.error("Fetch error:", error.message);
    return [];
  }
}

// ✅ SCORING ENGINE (ADAPTIVE AI)
function scoreProduct(product, tokens) {
  let score = 0;

  const title = normalize(product.title);
  const tags = normalize(product.tags || "");

  tokens.forEach((word) => {
    if (title.includes(word)) score += 20;
    if (tags.includes(word)) score += 10;
  });

  // ✅ BOOST IF MULTIPLE WORD MATCH
  const matchCount = tokens.filter((t) => title.includes(t)).length;
  if (matchCount >= 2) score += 50;

  return score;
}

// ✅ MAIN SEARCH
export async function searchProducts(query) {
  try {
    const products = await fetchProducts();

    let tokens = tokenize(query);

    // ✅ EXPAND USING LEARNING
    tokens = expandTokens(tokens);

    const scored = products
      .map((p) => ({
        product: p,
        score: scoreProduct(p, tokens),
      }))
      .filter((p) => p.score > 0);

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 10).map((item) => ({
      title: item.product.title,
      price: item.product.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${item.product.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
