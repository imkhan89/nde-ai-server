const fs = require("fs")
const path = require("path")

const PRODUCT_INDEX_PATH =
path.join(__dirname,"../data/product_index.json")

let productIndex = []

function loadProductIndex(){

try{

if(!fs.existsSync(PRODUCT_INDEX_PATH)){

console.log("Product index not found for sales engine")

productIndex = []

return

}

const raw = fs.readFileSync(PRODUCT_INDEX_PATH)

productIndex = JSON.parse(raw)

console.log("Sales conversion engine product index loaded")

}catch(err){

console.log("Sales engine product index error:",err.message)

productIndex = []

}

}

function normalize(text){

if(!text) return ""

return text
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.trim()

}

function findProductsByKeyword(keyword){

const key = normalize(keyword)

let results = []

productIndex.forEach(product=>{

if(!product.title) return

const title = normalize(product.title)

if(title.includes(key)){

results.push(product)

}

})

return results.slice(0,5)

}

function buildProductMessage(products){

if(!products || !products.length){

return null

}

let msg = "Recommended Products\n\n"

products.forEach((p,index)=>{

msg += (index+1)+". "+p.title+"\n"

if(p.url){

msg += p.url+"\n"

}

msg += "\n"

})

return msg

}

function suggestUpsellProducts(query){

const q = normalize(query)

let upsellParts = []

if(q.includes("air filter")){

upsellParts = [
"cabin filter",
"oil filter",
"spark plug"
]

}

else if(q.includes("brake pad")){

upsellParts = [
"brake disc",
"brake cleaner"
]

}

else if(q.includes("oil filter")){

upsellParts = [
"engine oil",
"air filter"
]

}

return upsellParts

}

function buildUpsellMessage(parts){

if(!parts.length) return null

let msg = "Recommended Add-ons\n\n"

parts.forEach(p=>{

msg += "• "+p+"\n"

})

return msg

}

function generateSalesResponse(query){

const products = findProductsByKeyword(query)

const upsells = suggestUpsellProducts(query)

let response = ""

const productMsg = buildProductMessage(products)

if(productMsg){

response += productMsg

}

const upsellMsg = buildUpsellMessage(upsells)

if(upsellMsg){

response += "\n"+upsellMsg

}

return response || null

}

module.exports = {

loadProductIndex,
generateSalesResponse

}
