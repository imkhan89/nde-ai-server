import { searchIndex } from "./product_index.js"

export function searchEngine(query) {

  if (!query) return []

  const results = searchIndex(query)

  return results.slice(0,5)

}
