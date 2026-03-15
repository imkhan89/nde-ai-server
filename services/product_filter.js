export function filterProducts(products) {

  if (!products) return []

  return products.filter(p => {

    if (!p.title) return false

    if (p.status && p.status !== "active") return false

    return true

  })

}
