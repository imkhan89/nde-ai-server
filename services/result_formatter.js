export function formatResults(products = []) {
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    vendor: p.vendor,
    type: p.product_type,
    price: p.price,
    sku: p.sku,
    tags: p.tags
  }));
}

export function formatSingleResult(product) {
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    type: product.product_type,
    price: product.price,
    sku: product.sku,
    tags: product.tags
  };
}

export default {
  formatResults,
  formatSingleResult
};
