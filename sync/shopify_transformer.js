export function transformShopifyProduct(product) {
  const variant = product.variants?.[0] || {};

  return {
    id: String(product.id),
    title: product.title || "",
    handle: product.handle || "",
    vendor: product.vendor || "",
    product_type: product.product_type || "",
    price: parseFloat(variant.price || 0),
    sku: variant.sku || "",
    tags: product.tags || "",
    created_at: product.created_at || null,
    updated_at: product.updated_at || null
  };
}

export function transformProducts(products = []) {
  return products.map(transformShopifyProduct);
}

export default {
  transformShopifyProduct,
  transformProducts
};
