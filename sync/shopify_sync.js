import db from "../database/database.js";
import fetch from "node-fetch";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

const API_VERSION = "2024-01";

async function fetchProducts(pageInfo = null) {
  let url = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/products.json?limit=250`;

  if (pageInfo) {
    url += `&page_info=${pageInfo}`;
  }

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return {
    products: data.products || [],
    link: response.headers.get("link"),
  };
}

function extractNextPage(linkHeader) {
  if (!linkHeader) return null;

  const match = linkHeader.match(/page_info=([^&>]+)/);

  if (match) {
    return match[1];
  }

  return null;
}

function saveProduct(product) {
  const stmt = db.prepare(`
        INSERT OR REPLACE INTO products
        (id, title, handle, vendor, product_type, price, sku, tags, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  const variant = product.variants?.[0] || {};

  stmt.run(
    product.id,
    product.title,
    product.handle,
    product.vendor,
    product.product_type,
    variant.price || 0,
    variant.sku || "",
    product.tags || "",
    product.created_at,
    product.updated_at
  );
}

export async function runShopifySync() {
  console.log("Starting Shopify Sync");

  let pageInfo = null;
  let total = 0;

  while (true) {
    const { products, link } = await fetchProducts(pageInfo);

    if (!products.length) break;

    for (const product of products) {
      saveProduct(product);
      total++;
    }

    console.log(`Synced products: ${total}`);

    const next = extractNextPage(link);

    if (!next) break;

    pageInfo = next;
  }

  console.log(`Shopify Sync Completed. Total Products: ${total}`);
}

export default {
  runShopifySync,
};
