/* =====================================================
AUTOMOTIVE PARTS KNOWLEDGE GRAPH
===================================================== */

const PARTS_GRAPH = {

"brake pad":[
"pad",
"pads",
"disc pad",
"brake disc pad",
"brake pad"
],

"brake rotor":[
"disc rotor",
"rotor",
"brake disc"
],

"air filter":[
"air filter",
"air cleaner",
"engine air filter"
],

"oil filter":[
"oil filter"
],

"cabin filter":[
"cabin filter",
"ac filter",
"aircon filter"
],

"spark plug":[
"spark plug",
"plug"
],

"radiator":[
"radiator"
],

"radiator cap":[
"radiator cap"
],

"clutch plate":[
"clutch plate",
"clutch disc"
],

"shock absorber":[
"shock",
"shock absorber",
"suspension shock"
],

"control arm":[
"control arm",
"lower arm"
],

"ball joint":[
"ball joint"
],

"wheel bearing":[
"wheel bearing",
"bearing"
]

}

/* =====================================================
DETECT PART
===================================================== */

function detectPart(text){

const query = (text || "").toLowerCase()

for(const part in PARTS_GRAPH){

for(const keyword of PARTS_GRAPH[part]){

if(query.includes(keyword)){
return part
}

}

}

return null

}

module.exports = {
detectPart
}
