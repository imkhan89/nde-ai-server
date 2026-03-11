/* =====================================================
FAST PRODUCT SEARCH ENGINE
Searches local product index instead of Shopify search page
===================================================== */

const PRODUCTS = require("../data/products_index.json")

/* =====================================================
NORMALIZE TEXT
===================================================== */

function normalize(text){

if(!text) return ""

return text
.toString()
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}


/* =====================================================
MATCH SCORE ENGINE
===================================================== */

function scoreProduct(product, query){

let score = 0

const q = normalize(query)

const title = normalize(product.title)

if(title.includes(q)){
score += 100
}

if(product.part && q.includes(product.part)){
score += 50
}

if(product.make && q.includes(product.make)){
score += 30
}

if(product.model && q.includes(product.model)){
score += 30
}

if(product.position && q.includes(product.position)){
score += 20
}

return score

}


/* =====================================================
SEARCH PRODUCTS
===================================================== */

function searchProducts(query){

if(!query) return []

let results = []

for(const product of PRODUCTS){

const score = scoreProduct(product, query)

if(score > 0){

results.push({
product,
score
})

}

}

results.sort((a,b)=>b.score-a.score)

return results.slice(0,3).map(r=>r.product)

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

searchProducts

}
