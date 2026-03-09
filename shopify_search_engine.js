/* =====================================================
SHOPIFY SEARCH ENGINE
Builds correct Shopify search URLs
Handles:
Generation search
Fallback search
Generic product search
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
GENERIC PRODUCTS
(No vehicle required)
===================================================== */

const GENERIC_PRODUCTS = [

"engine oil",
"gear oil",
"coolant",
"radiator coolant",
"car shampoo",
"car polish",
"car perfume",
"horn",
"car horn",
"battery",
"engine flush",
"fuel additive"

]

function isGenericProduct(query){

const q = normalize(query)

for(const g of GENERIC_PRODUCTS){

if(q.includes(g)){
return true
}

}

return false

}

/* =====================================================
QUERY CLEANER
===================================================== */

function cleanQuery(query){

const q = normalize(query)

const words = q.split(" ")

const filtered = words.filter(w => w.length > 1)

return filtered.join(" ")

}

/* =====================================================
SHOPIFY SEARCH BUILDER
===================================================== */

function buildShopifySearch(query){

const base = "https://www.ndestore.com/search?q="

const cleaned = cleanQuery(query)

const encoded = cleaned.replace(/\s+/g,"+")

return base + encoded

}

/* =====================================================
FALLBACK SEARCH
===================================================== */

function buildFallbackSearch(data){

let parts=[]

if(data.part){
parts.push(data.part)
}

if(data.make){
parts.push(data.make)
}

if(data.model){
parts.push(data.model)
}

const query = parts.join(" ")

return buildShopifySearch(query)

}

/* =====================================================
MAIN SEARCH GENERATOR
===================================================== */

function generateSearch(data){

/* Generic product */

if(isGenericProduct(data.query)){

return buildShopifySearch(data.part || data.query)

}

/* Full search */

let searchQuery = data.query

let url = buildShopifySearch(searchQuery)

/* fallback if generation missing */

if(!data.generation){

url = buildFallbackSearch(data)

}

return url

}

module.exports = {

buildShopifySearch,
generateSearch

}
