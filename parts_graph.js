/* =====================================================
AUTOMOTIVE PARTS GRAPH
===================================================== */

const PARTS = {

"oil filter":[
"oil filter",
"engine oil filter"
],

"air filter":[
"air filter",
"engine air filter"
],

"cabin filter":[
"cabin filter",
"ac filter",
"aircon filter"
],

"fuel filter":[
"fuel filter"
],

"brake pad":[
"brake pad",
"brake pads"
],

"brake disc":[
"brake disc",
"brake rotor"
],

"spark plug":[
"spark plug",
"spark plugs"
]

}

function detectPart(text){

text = text.toLowerCase()

for(const part in PARTS){

for(const keyword of PARTS[part]){

if(text.includes(keyword)){
return part
}

}

}

return null

}

module.exports = {detectPart}
