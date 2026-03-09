/* =====================================================
AUTOMOTIVE AI CORE ENGINE
Handles:
Vehicle detection
Alias detection (Pakistan vehicles)
Year → generation conversion
Part detection
Shopify search query builder
===================================================== */

const parseQuery = require("./automotive_query_parser")
const { semanticPartDetection } = require("./semantic_parts_engine")
const fuzzyMatchPart = require("./fuzzy_parts_engine")

const VEHICLE_GENERATIONS = require("./data/vehicle_generations")

const { detectVehicleAlias } = require("./vehicle_alias_engine")

/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
GENERATION DETECTION
===================================================== */

function detectGeneration(make,model,year){

if(!make || !model || !year){
return null
}

for(const vehicle of VEHICLE_GENERATIONS){

if(vehicle.make === make && vehicle.model === model){

for(const range of vehicle.generations){

if(year >= range.start && year <= range.end){

return `${range.start}-${range.end}`

}

}

}

}

return null

}

/* =====================================================
PART DETECTION
===================================================== */

function detectPart(text){

let part = semanticPartDetection(text)

if(part){
return part
}

part = fuzzyMatchPart(text)

return part

}

/* =====================================================
QUERY BUILDER
===================================================== */

function buildQuery(data){

let parts = []

if(data.position){
parts.push(data.position)
}

if(data.part){
parts.push(data.part)
}

if(data.make){
parts.push(data.make)
}

if(data.model){
parts.push(data.model)
}

if(data.generation){
parts.push(data.generation)
}

return parts.join(" ")

}

/* =====================================================
MAIN ANALYZER
===================================================== */

function analyzeAutomotiveQuery(query){

const text = normalize(query)

/* Parse Standard Query */

const parsed = parseQuery(text)

/* Detect Pakistani Vehicle Alias */

const aliasVehicle = detectVehicleAlias(text)

/* Override vehicle if alias found */

let make = parsed.make
let model = parsed.model
let generation = null

if(aliasVehicle){

make = aliasVehicle.make
model = aliasVehicle.model
generation = aliasVehicle.generation

}

/* Detect Part */

const part = detectPart(text)

/* Detect Generation From Year */

if(!generation){

generation = detectGeneration(

make,
model,
parsed.year

)

}

/* Build Search Query */

const searchQuery = buildQuery({

position:parsed.position,
part:part,
make:make,
model:model,
generation:generation

})

return {

query:searchQuery,

make:make,
model:model,
year:parsed.year,

generation:generation,

position:parsed.position,

part:part

}

}

module.exports = {

analyzeAutomotiveQuery

}
