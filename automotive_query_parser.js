/* =====================================================
AUTOMOTIVE QUERY PARSER
Extracts make, model, year and position
===================================================== */

const { detectPosition } = require("./position_detection_engine")

/* =====================================================
KNOWN MAKES
===================================================== */

const MAKES = [

"honda",
"toyota",
"suzuki",
"kia",
"hyundai",
"daihatsu",
"mitsubishi",
"nissan"

]

/* =====================================================
KNOWN MODELS
===================================================== */

const MODELS = [

"civic",
"corolla",
"city",
"yaris",
"cultus",
"alto",
"wagonr",
"swift",
"hilux",
"sportage",
"elantra",
"mehran"

]

/* =====================================================
YEAR DETECTION
===================================================== */

function detectYear(text){

const match = text.match(/\b(19|20)\d{2}\b/)

if(match){
return parseInt(match[0])
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

function detectModel(text){

for(const model of MODELS){

if(text.includes(model)){
return model
}

}

return null

}

/* =====================================================
MAIN PARSER
===================================================== */

function parseQuery(text){

const make = detectMake(text)

const model = detectModel(text)

const year = detectYear(text)

const position = detectPosition(text)

return {

make,
model,
year,
position

}

}

module.exports = parseQuery
