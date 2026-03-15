import { fetchAllShopifyProducts } from "./shopify_paginator.js";
import { transformShopifyProducts } from "./shopify_transformer.js";
import { indexProducts, clearProductIndex } from "./product_indexer.js";

/*
NDE Automotive AI
Shopify Sync Engine

Full pipeline:
Shopify → Transform → Enrich → Index
*/

export async function runShopifySync() {

  const store = process.env.SHOPIFY_STORE;
  const token = process.env.SHOPIFY_TOKEN;

  if (!store || !token) {

    console.warn("Shopify credentials not configured");

    return {
      success: false,
      indexed: 0
    };

  }

  try {

    const rawProducts = await fetchAllShopifyProducts(store, token);

    const transformed = transformShopifyProducts(rawProducts);

    await clearProductIndex();

    await indexProducts(transformed);

    console.log(`AI indexed ${transformed.length} Shopify products`);

    return {
      success: true,
      indexed: transformed.length
    };

  } catch (error) {

    console.error("Shopify Sync Engine Error:", error);

    return {
      success: false,
      indexed: 0
    };

  }

}
