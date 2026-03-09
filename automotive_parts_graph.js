/* =====================================================
AUTOMOTIVE PART KNOWLEDGE GRAPH
Understands different customer part names
===================================================== */

const PART_GRAPH = {

"brake pad":[
"brake pad",
"brake pads",
"disc pad",
"disc pads",
"brake disc pad",
"pad",
"pads",
"brakepad",
"break pad"
],

"air filter":[
"air filter",
"engine air filter",
"airfilter",
"air cleaner"
],

"oil filter":[
"oil filter",
"engine oil filter",
"oilfilter"
],

"cabin filter":[
"cabin filter",
"ac filter",
"a c filter",
"aircon filter"
],

"spark plug":[
"spark plug",
"spark plugs",
"plug",
"plugs"
],

"brake rotor":[
"brake rotor",
"disc rotor",
"brake disc",
"disc"
],

"brake shoe":[
"brake shoe",
"rear brake shoe"
]

}

/* =====================================================
PART DETECTION
===================================================== */

function detectPartFromGraph(text){

const query = (text || "").toLowerCase()

for(const part in PART_GRAPH){

for(const keyword of PART_GRAPH[part]){

if(query.includes(keyword)){
return part
}

}

}

return null

}

module.exports = {
detectPartFromGraph
}
