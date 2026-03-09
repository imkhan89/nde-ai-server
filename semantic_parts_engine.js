/* =====================================================
AUTOMOTIVE SEMANTIC PARTS ENGINE
Purpose: Detect correct automotive part names
Fixes:
disc pad -> brake pad
disk pad -> brake pad
pad -> brake pad
disc -> brake rotor
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
PHRASE MAP (Highest Priority)
===================================================== */

const PHRASE_MAP = {

"disc pad":"brake pad",
"disk pad":"brake pad",
"disc brake pad":"brake pad",
"brake disc pad":"brake pad",

"brake pad":"brake pad",
"brake pads":"brake pad",
"front pad":"brake pad",
"rear pad":"brake pad",

"disc rotor":"brake rotor",
"disk rotor":"brake rotor",
"brake disc":"brake rotor",
"brake rotor":"brake rotor",

"engine oil":"engine oil",
"gear oil":"gear oil",

"air filter":"air filter",
"engine air filter":"air filter",

"oil filter":"oil filter",

"ac filter":"cabin filter",
"cabin filter":"cabin filter",

"fuel filter":"fuel filter",

"spark plug":"spark plug",
"spark plugs":"spark plug",

"radiator coolant":"coolant",
"engine coolant":"coolant",
"coolant":"coolant",

"horn":"horn",
"car horn":"horn",

"wiper blade":"wiper blade",
"wiper blades":"wiper blade",

"floor mat":"floor mat",
"floor mats":"floor mat"

}

/* =====================================================
WORD MAP
===================================================== */

const WORD_MAP = {

pad:"brake pad",
pads:"brake pad",

disc:"brake rotor",
disk:"brake rotor",
rotor:"brake rotor",

filter:"filter",

plug:"spark plug",

coolant:"coolant",

horn:"horn",

mat:"floor mat",
mats:"floor mat"

}

/* =====================================================
SEMANTIC DETECTOR
===================================================== */

function semanticPartDetection(query){

const text = normalize(query)

/* phrase detection */

for(const phrase in PHRASE_MAP){

if(text.includes(phrase)){

return PHRASE_MAP[phrase]

}

}

/* word detection */

const words = text.split(" ")

for(const word of words){

if(WORD_MAP[word]){

return WORD_MAP[word]

}

}

return null

}

module.exports = {

semanticPartDetection

}
