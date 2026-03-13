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
trim()

}

function loadIndex(){

try{

if(!fs.existsSync(PRODUCT_INDEX_PATH)){

console.log("Service kit index not found")

productIndex = []

return

}

const raw = fs.readFileSync(PRODUCT_INDEX_PATH)

productIndex = JSON.parse(raw)

console.log("Service kit AI loaded:",productIndex.length)

}catch(err){

console.log("Service kit engine error:",err.message)

productIndex = []

}

}

function searchProduct(keyword){

const q = normalize(keyword)

for(let p of productIndex){

if(!p.title) continue

const title = normalize(p.title)

if(title.includes(q)){

return {

title:p.title,
url:p.url

}

}

}

return null

}

function buildServiceKit(make,model,year){

const kitParts = [

"engine oil",
"oil filter",
"air filter",
"cabin filter",
"spark plug"

]

let results = []

kitParts.forEach(part=>{

const product = searchProduct(part+" "+make+" "+model)

if(product){

results.push(product)

}

})

return results

}

function buildServiceKitResponse(make,model,year){

const kit = buildServiceKit(make,model,year)

if(!kit.length){

return null

}

let msg =
"Recommended Service Kit for "+make+" "+model+" "+year+"\n\n"

kit.forEach((p,index)=>{

msg += (index+1)+". "+p.title+"\n"

if(p.url){

msg += p.url+"\n"

}

msg += "\n"

})

return msg

}

module.exports = {

loadIndex,
buildServiceKitResponse

}
