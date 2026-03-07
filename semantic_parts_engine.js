/* =====================================================
AUTOMOTIVE SEMANTIC PARTS ENGINE
Understands short / messy customer queries
===================================================== */

const PARTS_DICTIONARY = require("./data/parts_dictionary.json")

/* =====================================================
SHORT WORD MAPPING
===================================================== */

const SHORT_WORDS = {

pad:"brake pad",
pads:"brake pad",

disc:"brake rotor",
disk:"brake rotor",

plug:"spark plug",
plugs:"spark plug",

filter:"air filter",
filters:"air filter",

oil:"oil filter",

mat:"floor mat",
mats:"floor mat",

wiper:"wiper blade",
wipers:"wiper blade"

}

/* =====================================================
SEMANTIC PART DETECTION
===================================================== */

function semanticPartDetection(text){

text=text.toLowerCase()

let words=text.split(" ")

/* short word expansion */

for(const w of words){

if(SHORT_WORDS[w]){

return SHORT_WORDS[w]

}

}

/* dictionary detection */

for(const part of PARTS_DICTIONARY){

if(text.includes(part)){

return part

}

}

return ""

}

module.exports={

semanticPartDetection

}
