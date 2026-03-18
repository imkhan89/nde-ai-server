import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

// ✅ CLEAN TEXT
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

// ✅ TOKENIZE QUERY
function tokenize(query) {
  return normalize(query)
    .split(" ")
    .filter((w) => w.length > 1);
}

// ✅ SCORE ENGINE (SMART)
function scoreProduct(product, tokens) {
  let score = 0;

  const title = normalize(product.title);
  const tags = normalize(product.tags || "");

  tokens.forEach((word) => {
    if (title.includes(word)) score += 15;   // strong match
    if (tags.includes(word)) score += 10;    // medium match
  });

  // ✅ BOOST EXACT PHRASE MATCH
  if (title.includes(tokens.join(" "))) {
    score += 50;
  }

  return score;
}

// ✅ SEARCH PRODUCTS
export async function searchProducts(query) {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=100`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
    });

    const products = response.data.products || [];

    const tokens = tokenize(query);

    // ❌ If no tokens, return empty
    if (!tokens.length) return [];

    // ✅ SCORE + FILTER
    const scored = products
      .map((p) => ({
        product: p,
        score: scoreProduct(p, tokens),
      }))
      .filter((item) => item.score > 0);

    // ✅ SORT BY BEST MATCH
    scored.sort((a, b) => b.score - a.score);

    // ✅ RETURN TOP MATCHES ONLY
    return scored.slice(0, 10).map((item) => ({
      title: item.product.title,
      price: item.product.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${item.product.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.response?.data || error.message);
    return [];
  }
}
