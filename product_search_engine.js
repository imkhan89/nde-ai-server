/* =====================================================
PRODUCT SEARCH ENGINE
Fast local product index search
Verifies results before sending Shopify link
===================================================== */

const fs = require("fs")
const path = require("path")

const INDEX_PATH = path.join(__dirname,"data","product_index.json")

let PRODUCTS = []

/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

try{

PRODUCTS = JSON.parse(fs.readFileSync(INDEX_PATH))

}catch(e){

console.log("Product index not found")

}

/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
SEARCH PRODUCTS
===================================================== */

function searchProducts(query){

const q = normalize(query)

let results = []

for(const p of PRODUCTS){

if(p.searchable.includes(q)){

results.push(p)

if(results.length >= 5){
break
}

}

}

return results

}

/* =====================================================
BEST MATCH
===================================================== */

function findBestMatch(query){

const results = searchProducts(query)

if(results.length){

return results[0]

}

return null

}

/* =====================================================
VERIFY SEARCH
===================================================== */

function verifySearch(query){

const results = searchProducts(query)

if(results.length > 0){
return true
}

return false

}

/* =====================================================
BUILD PRODUCT URL
===================================================== */

function buildProductURL(handle){

return `https://www.ndestore.com/products/${handle}`

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {

searchProducts,
findBestMatch,
verifySearch,
buildProductURL

}
