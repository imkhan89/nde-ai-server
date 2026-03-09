/* =====================================================
AUTOMOTIVE AI CORE ENGINE
Handles:
Vehicle detection
Vehicle alias intelligence
Year → generation detection
Part detection
Position detection
Search query builder
===================================================== */

const parseQuery = require("./automotive_query_parser")

const { semanticPartDetection } = require("./semantic_parts_engine")

const fuzzyMatchPart = require("./fuzzy_parts_engine")

const VEHICLE_GENERATIONS = require("./data/vehicle_generations")

const { detectVehicle } = require("./vehicle_graph")

const { detectPart } = require("./parts_graph")

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

function detectPartSmart(text){

let part = detectPart(text)

if(part){
return part
}

part = semanticPartDetection(text)

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

if(data.part){
parts.push(data.part)
}

if(data.position){
parts.push(data.position)
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

/* parse structured query */

const parsed = parseQuery(text)

/* detect vehicle alias */

const vehicle = detectVehicle(text)

let make = parsed.make
let model = parsed.model
let generation = null

if(vehicle){

make = vehicle.make
model = vehicle.model

if(vehicle.generation){
generation = vehicle.generation
}

}

/* detect part */

const part = detectPartSmart(text)

/* detect generation from year */

if(!generation){

generation = detectGeneration(

make,
model,
parsed.year

)

}

/* build final search query */

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

/* =====================================================
EXPORT
===================================================== */

module.exports = {

analyzeAutomotiveQuery

}
