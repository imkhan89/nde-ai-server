import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// ✅ SEARCH PRODUCTS FROM SHOPIFY
export async function searchProducts(query) {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=50`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const products = response.data.products || [];

    const cleanQuery = query.toLowerCase();

    // ✅ FILTER MATCHING PRODUCTS
    const filtered = products.filter((product) => {
      return product.title.toLowerCase().includes(cleanQuery);
    });

    // ✅ FORMAT RESPONSE
    return filtered.map((product) => {
      return {
        title: product.title,
        price: product.variants?.[0]?.price || "0",
        url: `https://${SHOPIFY_STORE}/products/${product.handle}`,
      };
    });

  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
