const fs = require("fs")
const path = require("path")

const INDEX_PATH = path.join(__dirname,"../data/product_index.json")
const FITMENT_PATH = path.join(__dirname,"../data/product_fitment.json")

let productIndex = []
let fitmentDB = []

function loadIndex(){

try{

const raw = fs.readFileSync(INDEX_PATH,"utf8")
productIndex = JSON.parse(raw)

console.log("Product index loaded:",productIndex.length)

}catch(err){

console.log("Product index load error:",err.message)
productIndex = []

}

}

function loadFitment(){

try{

if(!fs.existsSync(FITMENT_PATH)){

console.log("Fitment DB not found")
fitmentDB = []
return

}

const raw = fs.readFileSync(FITMENT_PATH,"utf8")

fitmentDB = JSON.parse(raw)

console.log("Fitment DB loaded:",fitmentDB.length)

}catch(err){

console.log("Fitment DB error:",err.message)
fitmentDB = []

}

}

loadIndex()
loadFitment()

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function detectVehicle(query){

query = normalize(query)

let vehicle = {
make:null,
model:null,
year:null
}

const yearMatch = query.match(/\b(19|20)\d{2}\b/)

if(yearMatch){

vehicle.year = yearMatch[0]

}

if(query.includes("corolla")){
vehicle.make="toyota"
vehicle.model="corolla"
}

if(query.includes("civic")){
vehicle.make="honda"
vehicle.model="civic"
}

if(query.includes("swift")){
vehicle.make="suzuki"
vehicle.model="swift"
}

if(query.includes("cultus")){
vehicle.make="suzuki"
vehicle.model="cultus"
}

return vehicle

}

function vehicleMatch(product,vehicle){

if(!vehicle.model) return true

const pMake = normalize(product.make)
const pModel = normalize(product.model)

if(vehicle.make && pMake && !pMake.includes(vehicle.make)){
return false
}

if(vehicle.model && pModel && !pModel.includes(vehicle.model)){
return false
}

return true

}

function searchProducts(query){

if(!query) return {success:false}

const q = normalize(query)

const words = q.split(" ")

const vehicle = detectVehicle(query)

let results = []

productIndex.forEach(p=>{

const title = normalize(p.title)
const part = normalize(p.part)
const make = normalize(p.make)
const model = normalize(p.model)

if(!vehicleMatch(p,vehicle)){
return
}

let score = 0

words.forEach(w=>{

if(title.includes(w)) score += 3
if(part.includes(w)) score += 2
if(make.includes(w)) score += 1
if(model.includes(w)) score += 1

})

if(score > 0){

results.push({
score,
title:p.title,
url:p.url
})

}

})

results = results
.sort((a,b)=>b.score-a.score)
.slice(0,5)

if(results.length === 0){
return {success:false}
}

return {
success:true,
vehicle,
products:results
}

}

module.exports = {
searchProducts
}
