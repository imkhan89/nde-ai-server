import { scoreProduct } from "./relevance_score.js"

export function matchProducts(products, query) {

  if (!products) return []

  return products
    .map(p => ({
      product:p,
      score:scoreProduct(p,query)
    }))
    .sort((a,b)=>b.score-a.score)
    .map(x=>x.product)

}
