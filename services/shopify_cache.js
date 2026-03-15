let productsCache = [];

export function setCachedProducts(products) {

productsCache = products || [];

}

export function getCachedProducts() {

return productsCache;

}

export function getProductCount(){

return productsCache.length;

}
