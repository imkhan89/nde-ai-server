import { setProducts } from "./product_cache.js"
import { buildIndex } from "./product_index.js"

export function loadProducts(products) {

  if (!products) return

  setProducts(products)

  buildIndex()

}
