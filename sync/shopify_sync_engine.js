import { fetchShopifyPage } from "./shopify_paginator.js";
import { transformProducts } from "./shopify_transformer.js";
import { enrichProducts } from "./product_enricher.js";
import { indexProducts } from "./product_indexer.js";

export async function runShopifySyncEngine() {
  let pageInfo = null;
  let total = 0;

  while (true) {
    const { products, nextPage } = await fetchShopifyPage(pageInfo);

    if (!products || products.length === 0) break;

    const transformed = transformProducts(products);

    const enriched = enrichProducts(transformed);

    indexProducts(enriched);

    total += enriched.length;

    console.log(`Indexed ${total} products`);

    if (!nextPage) break;

    pageInfo = nextPage;
  }

  console.log(`Shopify Sync Engine completed. Total products: ${total}`);
}

export default {
  runShopifySyncEngine
};
