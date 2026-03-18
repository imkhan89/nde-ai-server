import axios from "axios";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

export async function searchProducts(query) {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=50`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
    });

    const products = response.data.products || [];

    const q = query.toLowerCase();

    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(q)
    );

    return filtered.map((p) => ({
      title: p.title,
      price: p.variants?.[0]?.price || "0",
      url: `https://${SHOPIFY_STORE}/products/${p.handle}`,
    }));
  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
