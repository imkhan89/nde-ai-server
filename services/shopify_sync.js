import axios from "axios";

let products = [];

export default async function startShopifySync() {

  try {

    const store = process.env.SHOPIFY_STORE;
    const token = process.env.SHOPIFY_TOKEN;

    if (!store || !token) {
      console.error("Shopify environment variables missing");
      return;
    }

    console.log("Starting Shopify sync...");

    const url = `https://${store}/admin/api/2024-01/products.json`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
      }
    });

    products = response.data.products || [];

    console.log(`Shopify Sync Complete: ${products.length} products loaded`);

  } catch (error) {

    console.error("Shopify Sync Error:", error.message);

  }

}
