/* =====================================================
SEMANTIC PART DETECTION ENGINE
Maps different user phrases to correct automotive part
===================================================== */

const PART_SYNONYMS = {

"brake pad":[
"brake pad",
"brake pads",
"disc pad",
"disc pads",
"brake disc pad",
"brake disc pads",
"brake disc",
"pad"
],

"air filter":[
"air filter",
"engine air filter"
],

"oil filter":[
"oil filter",
"engine oil filter"
],

"cabin filter":[
"cabin filter",
"ac filter",
"aircon filter"
],

"spark plug":[
"spark plug",
"spark plugs",
"plug"
],

"brake shoe":[
"brake shoe",
"rear brake shoe"
],

"brake rotor":[
"brake rotor",
"disc rotor",
"brake disc",
"disc"
]

}

/* =====================================================
DETECT SEMANTIC PART
===================================================== */

function semanticPartDetection(text){

const query = (text || "").toLowerCase()

for(const part in PART_SYNONYMS){

for(const phrase of PART_SYNONYMS[part]){

if(query.includes(phrase)){
return part
}

}

}

return null

}

module.exports = {
semanticPartDetection
}
