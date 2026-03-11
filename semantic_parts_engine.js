/* =====================================================
SEMANTIC PART DETECTION ENGINE
Maps user phrases to correct automotive part
===================================================== */

const PART_SYNONYMS = {

"brake pad":[
"brake pad",
"brake pads",
"disc pad",
"disc pads",
"brake disc pad",
"brake disc pads",
"brakepad",
"break pad",
"break pads",
"pad"
],

"air filter":[
"air filter",
"engine air filter",
"air cleaner",
"airfilter"
],

"oil filter":[
"oil filter",
"engine oil filter",
"oilfilter"
],

"cabin filter":[
"cabin filter",
"ac filter",
"aircon filter",
"ac cabin filter"
],

"spark plug":[
"spark plug",
"spark plugs",
"plug",
"sparkplug"
],

"brake shoe":[
"brake shoe",
"rear brake shoe",
"break shoe",
"drum brake shoe"
],

"brake rotor":[
"brake rotor",
"disc rotor",
"brake disc",
"disc"
],

"shock absorber":[
"shock absorber",
"shock",
"car shock",
"shock absorber front",
"shock absorber rear"
],

"wheel bearing":[
"wheel bearing",
"hub bearing"
],

"control arm":[
"control arm",
"suspension arm"
],

"tie rod":[
"tie rod",
"steering rod"
],

"radiator":[
"radiator",
"engine radiator"
],

"radiator fan":[
"radiator fan",
"cooling fan"
]

}


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
SEMANTIC DETECTION
===================================================== */

function semanticPartDetection(text){

const query = normalize(text)

const words = query.split(" ")

for(const part in PART_SYNONYMS){

for(const phrase of PART_SYNONYMS[part]){

const p = phrase.toLowerCase()

if(p.includes(" ")){

if(query.includes(p)){
return part
}

}else{

if(words.includes(p)){
return part
}

}

}

}

return null

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {
semanticPartDetection
}
