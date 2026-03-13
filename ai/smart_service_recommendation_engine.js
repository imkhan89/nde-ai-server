const fs = require("fs")
const path = require("path")

const indexFile = path.join(__dirname,"../data/product_index.json")

let products = []

function loadProducts(){

try{

const raw = fs.readFileSync(indexFile,"utf8")

products = JSON.parse(raw)

}catch(err){

console.log("Service recommendation index error:",err.message)

products = []

}

}

loadProducts()

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function findProducts(keyword){

const k = normalize(keyword)

return products.filter(p=>{

const title = normalize(p.title)

return title.includes(k)

}).slice(0,1)

}

function buildOilChangeKit(make,model){

let kit = []

const oilFilter = findProducts("oil filter")
const airFilter = findProducts("air filter")
const cabinFilter = findProducts("cabin filter")
const sparkPlug = findProducts("spark plug")

oilFilter.forEach(p=>kit.push(p))
airFilter.forEach(p=>kit.push(p))
cabinFilter.forEach(p=>kit.push(p))
sparkPlug.forEach(p=>kit.push(p))

return kit.slice(0,4)

}

function buildBrakeServiceKit(){

let kit = []

const brakePad = findProducts("brake pad")
const brakeDisc = findProducts("brake disc")
const brakeRotor = findProducts("brake rotor")

brakePad.forEach(p=>kit.push(p))
brakeDisc.forEach(p=>kit.push(p))
brakeRotor.forEach(p=>kit.push(p))

return kit.slice(0,3)

}

function getServiceRecommendations(part,make,model){

const p = normalize(part)

if(p.includes("oil")){
return buildOilChangeKit(make,model)
}

if(p.includes("brake")){
return buildBrakeServiceKit(make,model)
}

return []

}

module.exports = {
getServiceRecommendations
}
