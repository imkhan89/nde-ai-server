import axios from "axios";

// ✅ USE YOUR EXISTING VARIABLES (FROM RAILWAY)
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

// ✅ SEARCH PRODUCTS
export async function searchProducts(query) {
  try {
    if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
      console.log("Missing Shopify ENV");
      return [];
    }

    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=50`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const products = response.data.products || [];

    const q = query.toLowerCase();

    // ✅ IMPROVED MATCH (NOT STRICT)
    const filtered = products.filter((p) => {
      const title = p.title.toLowerCase();

      return q.split(" ").some(word => title.includes(word));
    });

    return filtered.map((p) => ({
      title: p.title,
      price: p.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${p.handle}`,
    }));

  } catch (error) {
    console.error("Search error:", error.response?.data || error.message);
    return [];
  }
}
