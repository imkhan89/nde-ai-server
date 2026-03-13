const fs = require("fs")
const path = require("path")
const ranker = require("./search_ranker")

let productIndex = []

try{

const filePath = path.join(__dirname,"../data/product_index.json")

const raw = fs.readFileSync(filePath,"utf8")

productIndex = JSON.parse(raw)

console.log("Local product index loaded:",productIndex.length)

}catch(err){

console.log("Product index load error:",err.message)

}

function searchProducts(query){

query = query.toLowerCase()

let results = productIndex.filter(product => {

const title = (product.title || "").toLowerCase()
const tags = (product.tags || "").toLowerCase()

return title.includes(query) || tags.includes(query)

})

results = ranker.rankProducts(results, query)

return results.slice(0,5)

}

module.exports = {
searchProducts
}
