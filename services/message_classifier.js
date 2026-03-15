export function classifyMessage(text) {

  if (!text) return "unknown"

  const q = text.toLowerCase()

  if (q.includes("price")) return "price_query"

  if (q.includes("available")) return "availability_query"

  if (q.includes("fit")) return "fitment_query"

  if (q.includes("hello") || q.includes("hi")) return "greeting"

  return "product_search"

}
