import { getProducts } from "../sync/shopify_sync.js"
import { normalizeQuery } from "./query_normalizer.js"

export function searchProduct(query) {

  if (!query) return []

  const q = normalizeQuery(query)

  const products = getProducts()

  if (!products || products.length === 0) return []

  const results = products.filter(product => {

    const title = (product.title || "").toLowerCase()
    const body = (product.body_html || "").toLowerCase()
    const vendor = (product.vendor || "").toLowerCase()
    const type = (product.product_type || "").toLowerCase()

    return (
      title.includes(q) ||
      body.includes(q) ||
      vendor.includes(q) ||
      type.includes(q)
    )

  })

  return results.slice(0,5)
}
