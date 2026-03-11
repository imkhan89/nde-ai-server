/* =====================================================
AUTOMOTIVE QUERY PARSER
Extracts make, model, year and position
===================================================== */

const { detectPosition } = require("./position_detection_engine")


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

"honda",
"toyota",
"suzuki",
"kia",
"hyundai",
"daihatsu",
"mitsubishi",
"nissan",
"mg",
"changan",
"dfsk",
"proton",
"haval"

]


/* =====================================================
KNOWN MODELS
===================================================== */

const MODELS = [

"civic",
"city",
"corolla",
"yaris",
"cultus",
"alto",
"wagonr",
"swift",
"mehran",
"hilux",
"fortuner",
"prado",
"sportage",
"picanto",
"elantra",
"tucson",
"sonata",
"hs",
"zs",
"alsvin",
"oshan",
"saga",
"x70",
"h6"

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

function parseQuery(input){

const text = normalize(input)

if(!text){

return {
make:null,
model:null,
year:null,
position:null
}

}

const make = detectMake(text)

const model = detectModel(text)

const year = detectYear(text)

let position = null

try{
position = detectPosition(text)
}catch(err){
position = null
}

return {

make,
model,
year,
position

}

}


/* =====================================================
EXPORT
===================================================== */

module.exports = parseQuery
