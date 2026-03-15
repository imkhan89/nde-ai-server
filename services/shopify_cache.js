// Shopify in-memory cache

let productsCache = []

export function setCachedProducts(products) {

    if (!Array.isArray(products)) {
        productsCache = []
        return
    }

    productsCache = products
}

export function getCachedProducts() {
    return productsCache
}

export function getProductCount() {
    return productsCache.length
}

export function findProductByHandle(handle) {
    return productsCache.find(p => p.handle === handle)
}
