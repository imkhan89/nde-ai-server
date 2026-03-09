/* =====================================================
AUTOMOTIVE PART INTELLIGENCE GRAPH
Understands many variations of automotive parts
===================================================== */

const PART_GRAPH = {

"brake pad":{
keywords:[
"pad",
"pads",
"brake",
"disc",
"lining"
],
priority:[
"brake pad",
"disc pad",
"brake disc pad",
"disc brake pad"
]
},

"air filter":{
keywords:[
"air",
"filter",
"cleaner"
],
priority:[
"air filter",
"engine air filter",
"air cleaner"
]
},

"oil filter":{
keywords:[
"oil",
"filter"
],
priority:[
"oil filter",
"engine oil filter"
]
},

"cabin filter":{
keywords:[
"cabin",
"ac",
"aircon",
"filter"
],
priority:[
"cabin filter",
"ac filter",
"aircon filter"
]
},

"spark plug":{
keywords:[
"plug",
"spark"
],
priority:[
"spark plug"
]
},

"brake rotor":{
keywords:[
"rotor",
"disc",
"brake"
],
priority:[
"brake rotor",
"disc rotor",
"brake disc"
]
},

"brake shoe":{
keywords:[
"shoe",
"brake"
],
priority:[
"brake shoe",
"rear brake shoe"
]
}

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
DETECT PART
===================================================== */

function detectPartFromGraph(text){

const query = normalize(text)

/* priority detection first */

for(const part in PART_GRAPH){

for(const phrase of PART_GRAPH[part].priority){

if(query.includes(phrase)){
return part
}

}

}

/* keyword detection */

const tokens = query.split(" ")

for(const part in PART_GRAPH){

let score = 0

for(const keyword of PART_GRAPH[part].keywords){

if(tokens.includes(keyword)){
score++
}

}

if(score >= 2){
return part
}

}

return null

}

module.exports = {
detectPartFromGraph
}
