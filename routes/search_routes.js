import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

// ✅ CACHE (FAST)
let PRODUCT_CACHE = [];
let LAST_FETCH = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 min

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

// ✅ QUICK FETCH (LIMITED TO AVOID TIMEOUT)
async function fetchProducts() {
  try {
    const now = Date.now();

    if (PRODUCT_CACHE.length && now - LAST_FETCH < CACHE_TTL) {
      return PRODUCT_CACHE;
    }

    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=100`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
    });

    PRODUCT_CACHE = response.data.products || [];
    LAST_FETCH = now;

    console.log(`Loaded ${PRODUCT_CACHE.length} products`);

    return PRODUCT_CACHE;

  } catch (error) {
    console.error("Fetch error:", error.message);
    return [];
  }
}

// ✅ SCORE
function scoreProduct(product, tokens) {
  let score = 0;

  const title = normalize(product.title);
  const tags = normalize(product.tags || "");

  tokens.forEach((word) => {
    if (title.includes(word)) score += 20;
    if (tags.includes(word)) score += 10;
  });

  return score;
}

// ✅ SEARCH
export async function searchProducts(query) {
  try {
    const products = await fetchProducts();

    const tokens = tokenize(query);

    const scored = products
      .map((p) => ({
        product: p,
        score: scoreProduct(p, tokens),
      }))
      .filter((p) => p.score > 0);

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 5).map((item) => ({
      title: item.product.title,
      price: item.product.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${item.product.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
