import { indexProducts, clearProductIndex } from "./product_indexer.js";

/*
NDE Automotive AI
Shopify Product Sync Engine
Automatically pulls products and indexes them for AI search
*/

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

async function fetchProducts(cursor = null) {

  let url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`;

  if (cursor) {
    url += `&page_info=${cursor}`;
  }

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Shopify API error");
  }

  const data = await response.json();

  return data.products || [];
}

function transformProduct(product) {

  return {
    title: product.title || "",
    sku: product.variants?.[0]?.sku || "",
    brand: product.vendor?.toLowerCase() || "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    category: product.product_type?.toLowerCase() || "",
    price: parseFloat(product.variants?.[0]?.price || 0),
    raw: product
  };

}

export async function syncShopifyProducts() {

  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
    console.warn("Shopify credentials missing");
    return;
  }

  try {

    await clearProductIndex();

    let allProducts = [];

    const products = await fetchProducts();

    for (const p of products) {
      allProducts.push(transformProduct(p));
    }

    await indexProducts(allProducts);

    console.log(`Indexed ${allProducts.length} products`);

  } catch (error) {

    console.error("Shopify Sync Error:", error);

  }

}
