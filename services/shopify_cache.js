let productsCache = [];

/*
Store products after Shopify sync
*/
export function setCachedProducts(products) {

productsCache = products || [];

}

/*
Get all cached products
*/
export function getCachedProducts() {

return productsCache;

}

/*
Optional helper
*/
export function getProductCount(){

return productsCache.length;

}
