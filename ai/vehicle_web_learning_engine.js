/*
Vehicle Web Learning Engine
Learns vehicle model year ranges from website pages
*/

const fs = require("fs")
const path = require("path")

const VEHICLE_MEMORY =
path.join(__dirname,"../data/vehicle_range_memory.json")

let memory = {}

/* LOAD MEMORY */

function load(){

try{

if(fs.existsSync(VEHICLE_MEMORY)){

const raw = fs.readFileSync(VEHICLE_MEMORY,"utf8")
memory = JSON.parse(raw || "{}")

}

}catch(e){

memory = {}

}

}

load()

/* SAVE */

function save(){

try{

fs.writeFileSync(
VEHICLE_MEMORY,
JSON.stringify(memory,null,2)
)

}catch(e){}

}

/* NORMALIZE */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* DETECT RANGE */

function extractRange(text){

const match = text.match(/(\d{4}-\d{4})/)

if(match){
return match[1]
}

return null

}

/* DETECT VEHICLE */

function detectVehicle(text){

const clean = normalize(text)

const brands = [
"suzuki",
"toyota",
"honda",
"kia",
"hyundai",
"mg"
]

for(const brand of brands){

if(clean.includes(brand)){

const words = clean.split(" ")
const index = words.indexOf(brand)

if(index !== -1 && words[index+1]){

return {
make:brand,
model:words[index+1]
}

}

}

}

return null

}

/* LEARN FROM TEXT */

function learnFromText(text){

const vehicle = detectVehicle(text)

const range = extractRange(text)

if(vehicle && range){

const key =
`${vehicle.make} ${vehicle.model}`

memory[key] = range

save()

}

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

learnFromText,
detectRange

}
