const fs = require("fs")
const path = require("path")

const PRODUCT_SOURCE_PATH =
path.join(__dirname,"../data/shopify_products.json")

const PRODUCT_INDEX_PATH =
path.join(__dirname,"../data/product_index.json")

function normalize(text){

if(!text) return ""

return text
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.trim()

}

function buildIndex(){

try{

if(!fs.existsSync(PRODUCT_SOURCE_PATH)){

console.log("Shopify product source not found")

return

}

const raw = fs.readFileSync(PRODUCT_SOURCE_PATH)

const products = JSON.parse(raw)

if(!Array.isArray(products)){

console.log("Invalid Shopify product data")

return

}

const index = products.map(p=>{

return {

title:p.title || "",
url:p.url || "",
handle:p.handle || "",
keywords:normalize(p.title || "").split(" ")

}

})

fs.writeFileSync(
PRODUCT_INDEX_PATH,
JSON.stringify(index,null,2)
)

console.log("Product index built:",index.length)

}catch(err){

console.log("Index build error:",err.message)

}

}

buildIndex()

module.exports = {}
