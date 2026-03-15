/*
Shopify Product Cache
Stores products in memory so the AI and quick reply system
can search instantly without calling Shopify again.
*/

let productsCache = [];


/*
Set products after Shopify sync
Called by sync/shopify_sync.js
*/
export function setCachedProducts(products) {

  if (!Array.isArray(products)) {
    productsCache = [];
    return;
  }

  productsCache = products;

}


/*
Get all cached products
Used by AI and quick reply engine
*/
export function getCachedProducts() {

  return productsCache;

}


/*
Return number of cached products
Useful for debugging / health checks
*/
export function getProductCount() {

  return productsCache.length;

}


/*
Optional: find product by handle
*/
export function findProductByHandle(handle) {

  return productsCache.find(p => p.handle === handle);

}
