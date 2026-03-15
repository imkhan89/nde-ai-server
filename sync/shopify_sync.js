import fetch from "node-fetch";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

let productCache = [];

export async function syncShopifyProducts() {

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.warn("Shopify credentials missing. Skipping Shopify sync.");
    return [];
  }

  try {

    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Shopify API error:", response.status);
      return [];
    }

    const data = await response.json();

    if (data && data.products) {
      productCache = data.products;
      console.log(`Shopify Sync: ${productCache.length} products loaded`);
    }

    return productCache;

  } catch (error) {

    console.error("Shopify Sync Error:", error.message);
    return [];

  }
}

export function getCachedProducts() {
  return productCache;
}
