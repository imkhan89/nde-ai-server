import fetch from "node-fetch";

let productCache = [];

export async function syncShopifyProducts() {

  const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2023-10";

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.warn("Shopify credentials missing. Skipping Shopify sync.");
    return [];
  }

  try {

    let allProducts = [];
    let nextPageInfo = null;

    do {

      let url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250`;

      if (nextPageInfo) {
        url += `&page_info=${nextPageInfo}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        console.error("Shopify API error:", response.status);
        break;
      }

      const data = await response.json();

      if (data.products) {
        allProducts = allProducts.concat(data.products);
      }

      const linkHeader = response.headers.get("link");

      if (linkHeader && linkHeader.includes('rel="next"')) {

        const match = linkHeader.match(/page_info=([^&>]+)/);

        nextPageInfo = match ? match[1] : null;

      } else {
        nextPageInfo = null;
      }

    } while (nextPageInfo);

    productCache = allProducts;

    console.log(`Shopify Sync: ${productCache.length} products loaded`);

    return productCache;

  } catch (error) {

    console.error("Shopify Sync Error:", error.message);

    return [];
  }
}

export function getCachedProducts() {
  return productCache;
}
