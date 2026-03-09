/* =====================================================
AUTOMOTIVE AI CORE ENGINE
===================================================== */

const parseQuery = require("./automotive_query_parser")
const { semanticPartDetection } = require("./semantic_parts_engine")
const fuzzyMatchPart = require("./fuzzy_parts_engine")

const VEHICLE_GENERATIONS = require("./data/vehicle_generations")

/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/\+/g," ")
.replace(/-/g," ")
.replace(/\//g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
GENERATION DETECTOR
===================================================== */

function detectGeneration(make,model,year){

if(!year) return null

for(const v of VEHICLE_GENERATIONS){

if(v.make===make && v.model===model){

if(v.years.includes(parseInt(year))){

return v.years[0] + "-" + v.years[v.years.length-1]

}

}

}

return null

}

/* =====================================================
PART DETECTOR
===================================================== */

function detectPart(query){

let part = semanticPartDetection(query)

if(part) return part

part = fuzzyMatchPart(query)

return part

}

/* =====================================================
MAIN ANALYZER
===================================================== */

function analyzeAutomotiveQuery(query){

const text = normalize(query)

const parsed = parseQuery(text)

const make = parsed.make || ""
const model = parsed.model || ""
const year = parsed.year || null

const generation = detectGeneration(make,model,year)

const part = detectPart(text)

const finalQuery = `${part || ""} ${make} ${model} ${generation || ""}`.trim()

return{

query:finalQuery,
make,
model,
year,
generation,
part

}

}

module.exports={

analyzeAutomotiveQuery

}
