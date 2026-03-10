/* =====================================================
PRODUCT SEARCH ENGINE
Fast local product index search
===================================================== */

const fs = require("fs")
const path = require("path")

const INDEX_PATH = path.join(__dirname,"data","product_index.json")

let PRODUCTS = []

/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

try{

if(fs.existsSync(INDEX_PATH)){

const raw = fs.readFileSync(INDEX_PATH,"utf8")

if(raw){
PRODUCTS = JSON.parse(raw)
}

}

}catch(e){

console.log("Product index loading error:",e.message)
PRODUCTS = []

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

if(!p) continue

const searchable = normalize(p.searchable || p.title || "")

if(searchable.includes(q)){

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

if(results.length > 0){
return results[0]
}

return null

}

/* =====================================================
VERIFY SEARCH
===================================================== */

function verifySearch(query){

const results = searchProducts(query)

return results.length > 0

}

/* =====================================================
BUILD PRODUCT URL
===================================================== */

function buildProductURL(handle){

if(!handle) return ""

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
