export function scoreProduct(product, query) {

  if (!product || !query) return 0

  const title = (product.title || "").toLowerCase()

  if (title.includes(query)) return 10

  return 1

}
