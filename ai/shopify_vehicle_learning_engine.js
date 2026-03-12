/*
Shopify Vehicle Intelligence Engine
Learns vehicle model ranges directly from Shopify product titles
*/

const fs = require("fs")
const path = require("path")

const PRODUCT_INDEX =
path.join(__dirname,"../data/product_index.json")

const VEHICLE_MEMORY =
path.join(__dirname,"../data/vehicle_range_memory.json")

let memory = {}

/* LOAD MEMORY */

function loadMemory(){

try{

if(fs.existsSync(VEHICLE_MEMORY)){

const raw = fs.readFileSync(VEHICLE_MEMORY,"utf8")
memory = JSON.parse(raw || "{}")

}

}catch(e){

memory = {}

}

}

loadMemory()

/* SAVE MEMORY */

function saveMemory(){

try{

fs.writeFileSync(
VEHICLE_MEMORY,
JSON.stringify(memory,null,2)
)

}catch(e){}

}

/* EXTRACT RANGE FROM TEXT */

function extractRange(text){

const match = text.match(/\((\d{4}-\d{4})\)/)

if(match){
return match[1]
}

return null

}

/* EXTRACT MAKE MODEL */

function detectVehicle(text){

const clean = text.toLowerCase()

const brands = [
"suzuki",
"honda",
"toyota",
"kia",
"hyundai",
"mg"
]

for(const brand of brands){

if(clean.includes(brand)){

const words = clean.split(" ")

const i = words.indexOf(brand)

if(i !== -1 && words[i+1]){

return {
make:brand,
model:words[i+1]
}

}

}

}

return null

}

/* LEARN FROM SHOPIFY PRODUCTS */

function learnVehicles(){

try{

if(!fs.existsSync(PRODUCT_INDEX)) return

const raw = fs.readFileSync(PRODUCT_INDEX,"utf8")

const products = JSON.parse(raw || "[]")

for(const p of products){

const title = p.title || ""

const vehicle = detectVehicle(title)

const range = extractRange(title)

if(vehicle && range){

const key =
`${vehicle.make} ${vehicle.model}`

memory[key] = range

}

}

saveMemory()

}catch(e){}

}

/* DETECT RANGE */

function detectRange(make,model){

const key =
`${make.toLowerCase()} ${model.toLowerCase()}`

if(memory[key]){

return memory[key]

}

return null

}

module.exports = {

learnVehicles,
detectRange

}
