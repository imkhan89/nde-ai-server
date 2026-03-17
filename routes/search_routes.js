import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// ✅ CLEAN + SPLIT QUERY
function extractKeywords(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter((word) => word.length > 1);
}

// ✅ SCORE PRODUCT BASED ON MATCH
function scoreProduct(product, keywords) {
  let score = 0;

  const title = product.title.toLowerCase();

  keywords.forEach((word) => {
    if (title.includes(word)) {
      score += 10;
    }
  });

  return score;
}

// ✅ SEARCH PRODUCTS FROM SHOPIFY
export async function searchProducts(query) {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=100`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const products = response.data.products || [];

    const keywords = extractKeywords(query);

    // ✅ SCORE + FILTER
    const scoredProducts = products
      .map((product) => {
        const score = scoreProduct(product, keywords);
        return { product, score };
      })
      .filter((item) => item.score > 0);

    // ✅ SORT BY BEST MATCH
    scoredProducts.sort((a, b) => b.score - a.score);

    // ✅ FORMAT RESPONSE
    return scoredProducts.map((item) => ({
      title: item.product.title,
      price: item.product.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${item.product.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
