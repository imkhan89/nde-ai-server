import axios from "axios";

let products = [];

export default async function startShopifySync() {

  try {

    console.log("Starting Shopify sync...");

    const response = await axios.get(
      `https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN
        }
      }
    );

    products = response.data.products;

    console.log(`Shopify Sync Complete: ${products.length} products loaded`);

  } catch (error) {

    console.error("Shopify Sync Error:", error.message);

  }

}
