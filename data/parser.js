/* ======================================================
AUTOMOTIVE QUERY PARSER
Production Version
====================================================== */

const { vehicles: VEHICLES } = require("./vehicle_database")

/* ======================================================
TEXT NORMALIZER
====================================================== */

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

/* ======================================================
YEAR DETECTION
====================================================== */

function detectYear(text){

const match = text.match(/\b(19|20)\d{2}\b/)

if(match){
return parseInt(match[0])
}

return null

}

/* ======================================================
VEHICLE DETECTION
====================================================== */

function detectVehicle(text){

if(!Array.isArray(VEHICLES)) return null

for(const v of VEHICLES){

const make = (v.make || "").toLowerCase()
const model = (v.model || "").toLowerCase()

if(!make || !model) continue

if(text.includes(make) && text.includes(model)){

return{
make,
model
}

}

}

return null

}

/* ======================================================
PART DETECTION
====================================================== */

function detectPart(text, PART_INDEX){

if(!PART_INDEX) return null

const words = text.split(" ")

for(const w of words){

if(PART_INDEX[w]){

return PART_INDEX[w].part || w

}

}

return null

}

/* ======================================================
POSITION / APPLICATION DETECTION
====================================================== */

function detectPosition(text){

const positions=[

"front",
"rear",
"left",
"right",

"front left",
"front right",
"rear left",
"rear right"

]

for(const p of positions){

if(text.includes(p)) return p

}

return null

}

/* ======================================================
MAIN PARSER
====================================================== */

function parse(query, PART_INDEX){

const text = normalize(query)

const vehicle = detectVehicle(text)

const year = detectYear(text)

const part = detectPart(text, PART_INDEX)

const position = detectPosition(text)

return{

vehicle: vehicle || {make:"",model:""},
year,
part,
position

}

}

/* ======================================================
EXPORT
====================================================== */

module.exports = parse
