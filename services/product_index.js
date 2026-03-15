import { getProducts } from "./product_cache.js"

let INDEX = []

export function buildIndex() {

  const products = getProducts()

  INDEX = products.map(p => ({
    id: p.id,
    title: (p.title || "").toLowerCase(),
    handle: p.handle
  }))

}

export function searchIndex(query) {

  if (!query) return []

  const q = query.toLowerCase()

  return INDEX.filter(p => p.title.includes(q))

}
