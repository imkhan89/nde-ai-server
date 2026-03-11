/* =====================================================
AUTOMOTIVE AI CORE ENGINE
Handles:

Vehicle detection
Part detection
Position detection
Fast product search
===================================================== */

const parseQuery = require("./automotive_query_parser")

const { semanticPartDetection } = require("./semantic_parts_engine")

const fuzzyMatchPart = require("./fuzzy_parts_engine")

const { detectVehicle } = require("./vehicle_graph")

const { detectPart } = require("./parts_graph")

const { searchProducts } = require("./product_search_engine")


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
SMART PART DETECTION
===================================================== */

function detectPartSmart(text){

if(!text) return null

let part = null

try{
part = detectPart(text)
}catch(err){}

if(part) return part

try{
part = semanticPartDetection(text)
}catch(err){}

if(part) return part

try{
part = fuzzyMatchPart(text)
}catch(err){}

if(part) return part

return null

}


/* =====================================================
PAKISTAN VEHICLE DEFAULTS
===================================================== */

function applyPakistanVehicleDefaults(make, model){

if(make === "toyota" && !model){
model = "corolla"
}

if(make === "honda" && !model){
model = "civic"
}

if(make === "suzuki" && !model){
model = "alto"
}

return { make, model }

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
part:null,
position:null,
products:[]
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

let vehicle = null

try{
vehicle = detectVehicle(text)
}catch(err){}

if(vehicle){

make = vehicle.make || make
model = vehicle.model || model

}


/* =====================================================
PAKISTAN DEFAULT VEHICLES
===================================================== */

const vehicleDefaults = applyPakistanVehicleDefaults(make, model)

make = vehicleDefaults.make
model = vehicleDefaults.model


/* =====================================================
PART DETECTION
===================================================== */

const part = detectPartSmart(text)


/* =====================================================
POSITION
===================================================== */

const position = parsed.position || null


/* =====================================================
BUILD SEARCH QUERY
===================================================== */

let searchQuery = ""

if(part) searchQuery += part + " "

if(position) searchQuery += position + " "

if(make) searchQuery += make + " "

if(model) searchQuery += model + " "

searchQuery = searchQuery.trim()


/* =====================================================
FAST PRODUCT SEARCH
===================================================== */

let products = []

try{

products = searchProducts(searchQuery)

}catch(err){

products = []

}


/* =====================================================
RETURN RESULT
===================================================== */

return {

query:searchQuery,

make:make || null,

model:model || null,

part:part || null,

position:position || null,

products:products

}

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

analyzeAutomotiveQuery

}
