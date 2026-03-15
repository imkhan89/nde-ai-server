export function rankProducts(products) {

  if (!products) return []

  return products.sort((a,b)=>{

    const aScore = a.title.length
    const bScore = b.title.length

    return aScore - bScore

  })

}
