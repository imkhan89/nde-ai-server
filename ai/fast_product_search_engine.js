const fs = require("fs")
const path = require("path")

const PRODUCT_INDEX_PATH =
path.join(__dirname,"../data/product_index.json")

let productIndex = []

function normalize(text){

if(!text) return ""

return text
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.trim()

}

function loadProductIndex(){

try{

if(!fs.existsSync(PRODUCT_INDEX_PATH)){

console.log("Fast search index not found")

productIndex = []

return

}

const raw = fs.readFileSync(PRODUCT_INDEX_PATH)

productIndex = JSON.parse(raw)

console.log("Fast product search index loaded:",productIndex.length)

}catch(err){

console.log("Fast search index error:",err.message)

productIndex = []

}

}

function searchProducts(query){

if(!query) return []

const q = normalize(query)

const words = q.split(" ")

let results = []

for(let product of productIndex){

if(!product.title) continue

const title = normalize(product.title)

let score = 0

words.forEach(w=>{

if(title.includes(w)){

score++

}

})

if(score > 0){

results.push({

title:product.title,
url:product.url,
score:score

})

}

}

results.sort((a,b)=> b.score - a.score)

return results.slice(0,3)

}

function buildSearchResponse(query){

const results = searchProducts(query)

if(!results.length){

return null

}

let msg = "Top Matching Products\n\n"

results.forEach((r,index)=>{

msg += (index+1)+". "+r.title+"\n"

if(r.url){

msg += r.url+"\n"

}

msg += "\n"

})

return msg

}

module.exports = {

loadProductIndex,
buildSearchResponse

}
