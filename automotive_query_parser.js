/* =====================================================
AUTOMOTIVE QUERY PARSER
Detects:
Vehicle Make
Vehicle Model
Vehicle Year
Part Position
Builds structured query for AI engine
===================================================== */

const VEHICLE_LIST = require("./data/vehicle_list.txt")

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
KNOWN MAKES
===================================================== */

const MAKES = [

"toyota",
"honda",
"suzuki",
"kia",
"hyundai",
"nissan",
"mitsubishi",
"changan",
"haval",
"mg",
"proton",
"daihatsu"

]

/* =====================================================
POSITION DETECTION
===================================================== */

const POSITION_WORDS = {

front:"front",
rear:"rear",
left:"left",
right:"right",

upper:"upper",
lower:"lower",

lh:"left",
rh:"right"

}

/* =====================================================
YEAR DETECTION
===================================================== */

function detectYear(text){

const yearMatch = text.match(/\b(19|20)\d{2}\b/)

if(yearMatch){

return parseInt(yearMatch[0])

}

return null

}

/* =====================================================
MAKE DETECTION
===================================================== */

function detectMake(text){

for(const make of MAKES){

if(text.includes(make)){
return make
}

}

return null

}

/* =====================================================
MODEL DETECTION
===================================================== */

function detectModel(text,make){

if(!make) return null

const words = text.split(" ")

const makeIndex = words.indexOf(make)

if(makeIndex >= 0 && words.length > makeIndex+1){

return words[makeIndex+1]

}

return null

}

/* =====================================================
POSITION DETECTION
===================================================== */

function detectPosition(text){

const words = text.split(" ")

for(const word of words){

if(POSITION_WORDS[word]){
return POSITION_WORDS[word]
}

}

return null

}

/* =====================================================
MAIN PARSER
===================================================== */

function parseQuery(query){

const text = normalize(query)

const year = detectYear(text)

const make = detectMake(text)

const model = detectModel(text,make)

const position = detectPosition(text)

return {

make,
model,
year,
position

}

}

module.exports = parseQuery
