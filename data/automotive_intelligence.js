/* =====================================================
AUTOMOTIVE INTELLIGENCE ENGINE
GLOBAL PART INDEX BUILDER
===================================================== */

const PARTS = require("./parts_dictionary.json")

/* =====================================================
TEXT NORMALIZER
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
GLOBAL PART INDEX
===================================================== */

const GLOBAL_PART_INDEX = {}

if(PARTS && typeof PARTS === "object"){

for(const part in PARTS){

const base = normalize(part)

GLOBAL_PART_INDEX[base] = {
part: base,
position: PARTS[part].position || ""
}

/* ALIASES */

const aliases = PARTS[part].aliases || []

for(const alias of aliases){

const a = normalize(alias)

GLOBAL_PART_INDEX[a] = {
part: base,
position: PARTS[part].position || ""
}

}

}

}

/* =====================================================
PART DETECTION
===================================================== */

function detectPart(text){

const words = normalize(text).split(" ")

for(const w of words){

if(GLOBAL_PART_INDEX[w]){

return GLOBAL_PART_INDEX[w]

}

}

return null

}

/* =====================================================
MAIN ANALYZER
===================================================== */

function analyzeQuery(query){

const text = normalize(query)

const partData = detectPart(text)

return {

part: partData ? partData.part : null,
position: partData ? partData.position : null,
query

}

}

/* =====================================================
EXPORTS
===================================================== */

module.exports = {
GLOBAL_PART_INDEX,
analyzeQuery
}
