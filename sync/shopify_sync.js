import db from "../database/database.js";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

/*
Shopify API version
*/
const API_VERSION = "2024-01";

/*
Sync products from Shopify to SQLite database
*/
export async function syncShopifyProducts() {
  try {
    console.log("Starting Shopify product sync...");

    let hasNextPage = true;
    let pageInfo = null;
    let totalSynced = 0;

    while (hasNextPage) {

      let url = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/products.json?limit=250`;

      if (pageInfo) {
        url += `&page_info=${pageInfo}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
      }

      const data = await response.json();
      const products = data.products || [];

      for (const product of products) {

        db.prepare(`
          INSERT OR REPLACE INTO products
          (id, title, handle)
          VALUES (?, ?, ?)
        `).run(
          product.id,
          product.title,
          product.handle
        );

        totalSynced++;
      }

      /*
      Pagination handling
      */
      const linkHeader = response.headers.get("link");

      if (linkHeader && linkHeader.includes('rel="next"')) {

        const match = linkHeader.match(/page_info=([^&>]+)/);

        if (match) {
          pageInfo = match[1];
        } else {
          hasNextPage = false;
        }

      } else {
        hasNextPage = false;
      }

    }

    console.log(`Shopify sync completed. Products synced: ${totalSynced}`);

  } catch (error) {

    console.error("Shopify sync failed:", error.message);

  }
}
