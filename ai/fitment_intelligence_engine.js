const fs = require("fs")
const path = require("path")

const fitmentFile = path.join(__dirname,"../data/product_fitment.json")

let fitmentDB = {}

function ensureFile(){

if(!fs.existsSync(fitmentFile)){
fs.writeFileSync(fitmentFile,"{}")
}

}

function loadDB(){

ensureFile()

try{

const raw = fs.readFileSync(fitmentFile,"utf8")

fitmentDB = JSON.parse(raw)

console.log("Fitment intelligence loaded")

}catch(err){

console.log("Fitment DB load error:",err.message)

fitmentDB = {}

}

}

function saveDB(){

fs.writeFileSync(fitmentFile,JSON.stringify(fitmentDB,null,2))

}

function learnFitment(productTitle,make,model,year){

if(!productTitle || !make || !model) return

const key = `${make}_${model}`

if(!fitmentDB[key]){
fitmentDB[key] = []
}

fitmentDB[key].push({
product:productTitle,
year:year || ""
})

saveDB()

}

function getFitmentProducts(make,model){

const key = `${make}_${model}`

if(fitmentDB[key]){
return fitmentDB[key]
}

return []

}

function checkFitment(productTitle,make,model){

const list = getFitmentProducts(make,model)

const normalized = productTitle.toLowerCase()

return list.some(item=>{
return item.product.toLowerCase() === normalized
})

}

loadDB()

module.exports = {
learnFitment,
getFitmentProducts,
checkFitment
}
