import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// ✅ CACHE (AUTO-LEARNING)
let PRODUCT_CACHE = [];
let LAST_FETCH = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

// ✅ FETCH ALL PRODUCTS (AUTO EXPAND DATASET)
async function fetchAllProducts() {
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

      const linkHeader = response.headers.link;

      if (linkHeader && linkHeader.includes('rel="next"')) {
        const match = linkHeader.match(/<([^>]+)>; rel="next"/);
        url = match ? match[1] : null;
      } else {
        url = null;
      }
    }

    PRODUCT_CACHE = allProducts;
    LAST_FETCH = now;

    console.log(`Loaded ${PRODUCT_CACHE.length} products`);

    return PRODUCT_CACHE;
  } catch (error) {
    console.error("Shopify fetch error:", error.message);
    return [];
  }
}

// ✅ CLEAN TEXT
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

// ✅ TOKENIZE
function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 1);
}

// ✅ AUTO LEARN VEHICLES FROM DATA
function detectVehicle(queryTokens, products) {
  const vehicleSet = new Set();

  products.forEach((p) => {
    const words = normalize(p.title + " " + (p.tags || "")).split(" ");
    words.forEach((w) => {
      if (w.length > 3) vehicleSet.add(w);
    });
  });

  return queryTokens.find((t) => vehicleSet.has(t)) || null;
}

// ✅ SCORE PRODUCT (SMART MATCH)
function scoreProduct(product, tokens, vehicle) {
  let score = 0;

  const title = normalize(product.title);
  const tags = normalize(product.tags || "");

  tokens.forEach((t) => {
    if (title.includes(t)) score += 10;
    if (tags.includes(t)) score += 5;
  });

  if (vehicle && (title.includes(vehicle) || tags.includes(vehicle))) {
    score += 30;
  }

  return score;
}

// ✅ MAIN SEARCH FUNCTION
export async function searchProducts(query) {
  try {
    const products = await fetchAllProducts();

    const tokens = tokenize(query);

    const vehicle = detectVehicle(tokens, products);

    const scored = products
      .map((p) => ({
        product: p,
        score: scoreProduct(p, tokens, vehicle),
      }))
      .filter((p) => p.score > 0);

    scored.sort((a, b) => b.score - a.score);

    return scored.map((item) => ({
      title: item.product.title,
      price: item.product.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${item.product.handle}`,
    }));
  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
