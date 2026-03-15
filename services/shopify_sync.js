import axios from "axios";

let products = [];

export default async function startShopifySync() {

  const store = process.env.SHOPIFY_STORE;
  const token = process.env.SHOPIFY_TOKEN;

  if (!store || !token) {

    console.log("Shopify sync skipped (credentials not configured)");

    return;

  }

  try {

    console.log("Starting Shopify sync...");

    const url = `https://${store}/admin/api/2024-01/products.json`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": token
      }
    });

    products = response.data.products || [];

    console.log(`Shopify Sync Complete: ${products.length} products loaded`);

  } catch (error) {

    console.error("Shopify Sync Error:", error.message);

  }

}

export function getProducts() {
  return products;
}
