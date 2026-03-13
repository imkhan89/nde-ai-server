const fs = require("fs")
const path = require("path")

const PRODUCT_INDEX_PATH =
path.join(__dirname,"../data/product_index.json")

let productIndex = []

function loadProductIndex(){

try{

if(!fs.existsSync(PRODUCT_INDEX_PATH)){

console.log("Product index file not found")

productIndex = []

return

}

const raw = fs.readFileSync(PRODUCT_INDEX_PATH)

productIndex = JSON.parse(raw)

if(!Array.isArray(productIndex)){

console.log("Product index format invalid")

productIndex = []

return

}

console.log("Local product index loaded:",productIndex.length)

}catch(err){

console.log("Product index load error:",err.message)

productIndex = []

}

}

function searchProducts(query){

if(!query) return []

const q = query.toLowerCase()

return productIndex.filter(p=>{

if(!p.title) return false

return p.title.toLowerCase().includes(q)

}).slice(0,5)

}

function getProductIndex(){

return productIndex

}

loadProductIndex()

module.exports = {

searchProducts,
getProductIndex

}
