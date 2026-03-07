/* =====================================================
AUTOMOTIVE MARKETPLACE INTELLIGENCE ENGINE
Multi-Part Detection + Typo Correction
===================================================== */

const PARTS_DICTIONARY = require("./data/parts_dictionary.json")

/* =====================================================
SHORT WORD EXPANSION
===================================================== */

const SHORT_WORDS = {

pad:"brake pad",
pads:"brake pad",

disc:"brake rotor",
disk:"brake rotor",

plug:"spark plug",
plugs:"spark plug",

coil:"ignition coil",

filter:"air filter",
filters:"air filter",

oil:"oil filter",

mat:"floor mat",
mats:"floor mat",

wiper:"wiper blade",
wipers:"wiper blade"

}

/* =====================================================
TYPO CORRECTION
===================================================== */

const TYPO_MAP = {

break:"brake",
brek:"brake",

spak:"spark",
sparc:"spark",

flter:"filter",
filtr:"filter",

wipr:"wiper"

}

/* =====================================================
TYPO CLEANER
===================================================== */

function correctTypos(text){

for(const typo in TYPO_MAP){

const reg = new RegExp(`\\b${typo}\\b`,"g")

text = text.replace(reg,TYPO_MAP[typo])

}

return text

}

/* =====================================================
MULTI PART DETECTION
===================================================== */

function detectPartsAdvanced(text){

text = correctTypos(text)

let detected = []

const words = text.split(" ")

for(const w of words){

if(SHORT_WORDS[w]){

detected.push(SHORT_WORDS[w])

}

}

for(const part of PARTS_DICTIONARY){

if(text.includes(part)){

detected.push(part)

}

}

return [...new Set(detected)]

}

/* =====================================================
CONFIDENCE SCORE
===================================================== */

function confidenceScore(parts){

if(parts.length >= 2) return "high"

if(parts.length === 1) return "medium"

return "low"

}

module.exports = {

detectPartsAdvanced,
confidenceScore

}
