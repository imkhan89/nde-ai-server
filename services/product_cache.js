let PRODUCT_CACHE = []

export function setProducts(products) {
  PRODUCT_CACHE = products
}

export function getProducts() {
  return PRODUCT_CACHE
}

export function clearProducts() {
  PRODUCT_CACHE = []
}
