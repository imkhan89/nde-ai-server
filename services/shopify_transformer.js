import { enrichProducts } from "./product_enricher.js";

/*
NDE Automotive AI
Shopify Transformer

Transforms raw Shopify product objects
into AI-ready product objects.
*/

export function transformShopifyProducts(products = []) {

  if (!Array.isArray(products)) {
    return [];
  }

  const transformed = [];

  for (const product of products) {

    const base = buildBaseProduct(product);

    if (!base) continue;

    transformed.push(base);

  }

  const enriched = enrichProducts(transformed);

  return enriched;

}

function buildBaseProduct(product) {

  if (!product) return null;

  const variant = product.variants?.[0] || {};

  return {
    title: product.title || "",
    sku: variant.sku || "",
    brand: normalizeBrand(product.vendor),
    category: normalizeCategory(product.product_type),
    price: parseFloat(variant.price || 0),
    vehicle_make: null,
    vehicle_model: null,
    vehicle_year: null,
    raw: product
  };

}

function normalizeBrand(brand) {

  if (!brand) return "";

  return brand.toLowerCase().trim();

}

function normalizeCategory(category) {

  if (!category) return "";

  return category.toLowerCase().trim();

}
