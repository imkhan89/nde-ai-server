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
NORMALIZE INPUT
===================================================== */

function normalize(text){

if(!text) return ""

return text
.toString()
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}


/* =====================================================
GENERATION DETECTION
===================================================== */

function detectGeneration(make, model, year){

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
SMART PART DETECTION
Priority:

1 Direct graph match
2 Semantic match
3 Fuzzy fallback
===================================================== */

function detectPartSmart(text){

if(!text) return null

let part = null

try{
part = detectPart(text)
}catch(err){}

if(part){
return part
}

try{
part = semanticPartDetection(text)
}catch(err){}

if(part){
return part
}

try{
part = fuzzyMatchPart(text)
}catch(err){}

if(part){
return part
}

return null

}


/* =====================================================
QUERY BUILDER
Builds Shopify / search friendly query
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

if(data.year){
parts.push(data.year)
}

if(data.generation){
parts.push(data.generation)
}

return parts.join(" ").trim()

}


/* =====================================================
MAIN ANALYZER
===================================================== */

function analyzeAutomotiveQuery(query){

const text = normalize(query)

if(!text){

return {
query:null,
make:null,
model:null,
year:null,
generation:null,
position:null,
part:null
}

}


/* =====================================================
PARSE STRUCTURED QUERY
===================================================== */

let parsed = {}

try{
parsed = parseQuery(text) || {}
}catch(err){
parsed = {}
}


/* =====================================================
VEHICLE DETECTION
===================================================== */

let make = parsed.make || null
let model = parsed.model || null
let generation = null

let vehicle = null

try{
vehicle = detectVehicle(text)
}catch(err){}

if(vehicle){

make = vehicle.make || make
model = vehicle.model || model

if(vehicle.generation){
generation = vehicle.generation
}

}


/* =====================================================
PART DETECTION
===================================================== */

const part = detectPartSmart(text)


/* =====================================================
GENERATION FROM YEAR
===================================================== */

if(!generation){

generation = detectGeneration(
make,
model,
parsed.year
)

}


/* =====================================================
BUILD FINAL SEARCH QUERY
===================================================== */

const searchQuery = buildQuery({

position:parsed.position,
part:part,
make:make,
model:model,
year:parsed.year,
generation:generation

})


/* =====================================================
FALLBACK QUERY
===================================================== */

let finalQuery = searchQuery

if(!finalQuery || finalQuery.length < 3){

finalQuery = text

}


/* =====================================================
RETURN RESULT
===================================================== */

return {

query:finalQuery,

make:make,
model:model,
year:parsed.year || null,

generation:generation,

position:parsed.position || null,

part:part || null

}

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

analyzeAutomotiveQuery

}
