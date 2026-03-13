function rankProducts(products, query){

query = query.toLowerCase()

const ranked = products.map(product => {

let score = 0

const title = (product.title || "").toLowerCase()
const tags = (product.tags || "").toLowerCase()

if(title.includes(query)){
score += 10
}

if(tags.includes(query)){
score += 5
}

const words = query.split(" ")

words.forEach(word => {

if(title.includes(word)){
score += 2
}

})

return {
score,
product
}

})

ranked.sort((a,b) => b.score - a.score)

return ranked.map(r => r.product)

}

module.exports = {
rankProducts
}
