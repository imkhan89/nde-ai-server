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

function loadIndex(){

try{

if(!fs.existsSync(PRODUCT_INDEX_PATH)){

console.log("Vehicle fitment search index not found")

productIndex = []

return

}

const raw = fs.readFileSync(PRODUCT_INDEX_PATH)

productIndex = JSON.parse(raw)

console.log("Vehicle fitment search index loaded:",productIndex.length)

}catch(err){

console.log("Vehicle fitment index error:",err.message)

productIndex = []

}

}

function scoreProduct(product,words){

let title = normalize(product.title)

let score = 0

words.forEach(w=>{

if(title.includes(w)){

score++

}

})

return score

}

function searchProducts(part,make,model,year){

const queryWords = normalize(part + " " + make + " " + model).split(" ")

let results = []

for(let product of productIndex){

if(!product.title) continue

const title = normalize(product.title)

if(!title.includes(make.toLowerCase())) continue

if(!title.includes(model.toLowerCase())) continue

const score = scoreProduct(product,queryWords)

if(score > 0){

results.push({

title:product.title,
url:product.url,
score:score

})

}

}

results.sort((a,b)=> b.score - a.score)

return results.slice(0,5)

}

function buildFitmentResponse(part,make,model,year){

const results = searchProducts(part,make,model,year)

if(!results.length){

return null

}

let msg = "Compatible Parts for "+make+" "+model+" "+year+"\n\n"

results.forEach((r,index)=>{

msg += (index+1)+". "+r.title+"\n"

msg += r.url+"\n\n"

})

return msg

}

module.exports = {

loadIndex,
buildFitmentResponse

}
