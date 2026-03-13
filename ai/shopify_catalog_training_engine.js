const fs = require("fs")
const path = require("path")

const PRODUCT_INDEX_PATH =
path.join(__dirname,"../data/product_index.json")

const TRAINING_OUTPUT_PATH =
path.join(__dirname,"../data/catalog_training_data.json")

let productIndex = []
let trainingData = {
parts:[],
vehicles:[],
keywords:[]
}

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

console.log("Product index not found")

productIndex = []

return

}

const raw = fs.readFileSync(PRODUCT_INDEX_PATH)

productIndex = JSON.parse(raw)

console.log("Shopify product index loaded")

}catch(err){

console.log("Product index load error:",err.message)

productIndex = []

}

}

function addUnique(list,value){

if(!value) return

if(!list.includes(value)){

list.push(value)

}

}

function learnFromProductTitle(title){

const clean = normalize(title)

const words = clean.split(" ")

words.forEach(w=>{

if(w.length < 3) return

addUnique(trainingData.keywords,w)

})

const vehicleBrands = [
"suzuki",
"toyota",
"honda",
"daihatsu",
"nissan",
"mitsubishi",
"kia",
"hyundai"
]

vehicleBrands.forEach(make=>{

if(clean.includes(make)){

addUnique(trainingData.vehicles,make)

}

})

const parts = [
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"brake pad",
"brake shoe",
"radiator cap",
"engine mount",
"wiper blade",
"fuel pump"
]

parts.forEach(part=>{

if(clean.includes(part)){

addUnique(trainingData.parts,part)

}

})

}

function trainCatalog(){

if(!productIndex.length){

console.log("No products available for training")

return

}

productIndex.forEach(product=>{

if(product.title){

learnFromProductTitle(product.title)

}

})

fs.writeFileSync(

TRAINING_OUTPUT_PATH,

JSON.stringify(trainingData,null,2)

)

console.log("Catalog training completed")

console.log("Learned parts:",trainingData.parts.length)
console.log("Learned vehicles:",trainingData.vehicles.length)
console.log("Learned keywords:",trainingData.keywords.length)

}

function startTraining(){

loadProductIndex()

trainCatalog()

}

module.exports = {

startTraining

}
