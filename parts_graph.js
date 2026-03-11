/* =====================================================
AUTOMOTIVE PARTS GRAPH
===================================================== */

const PARTS = {

"engine oil":[
"engine oil",
"motor oil"
],

"gear oil":[
"gear oil",
"transmission gear oil"
],

"power steering oil":[
"power steering oil",
"steering fluid"
],

"brake fluid":[
"brake fluid",
"brake oil"
],

"coolant":[
"coolant",
"radiator coolant"
],

"radiator cap":[
"radiator cap",
"coolant radiator cap"
],

"radiator hose":[
"radiator hose",
"coolant hose"
],

"water pump":[
"water pump",
"engine water pump"
],

"thermostat":[
"engine thermostat",
"coolant thermostat"
],

"radiator fan":[
"radiator fan",
"cooling fan"
],

"fan motor":[
"radiator fan motor",
"cooling fan motor"
],

"alternator":[
"alternator",
"car alternator"
],

"starter motor":[
"starter motor",
"engine starter"
],

"battery":[
"car battery",
"vehicle battery"
],

"wiper blade":[
"wiper blade",
"windshield wiper blade"
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
"ac cabin filter"
],

"fuel filter":[
"fuel filter",
"engine fuel filter"
],

"spark plug":[
"spark plug",
"engine spark plug"
],

"brake pad":[
"brake pad",
"brake pads",
"disc brake pad"
],

"brake disc":[
"brake disc",
"brake rotor",
"disc rotor"
],

"brake shoe":[
"brake shoe",
"drum brake shoe"
],

"shock absorber":[
"shock absorber",
"car shock",
"shock"
],

"coil spring":[
"coil spring",
"suspension spring"
],

"control arm":[
"control arm",
"suspension arm"
],

"ball joint":[
"ball joint",
"suspension ball joint"
],

"tie rod":[
"tie rod",
"steering tie rod"
],

"tie rod end":[
"tie rod end",
"outer tie rod"
],

"wheel bearing":[
"wheel bearing",
"hub bearing"
],

"wheel hub":[
"wheel hub",
"hub assembly"
],

"headlight":[
"headlight",
"front headlamp"
],

"tail light":[
"tail light",
"rear tail lamp"
],

"fog light":[
"fog light",
"fog lamp"
],

"side mirror":[
"side mirror",
"door mirror"
],

"door handle":[
"door handle",
"car door handle"
],

"window regulator":[
"window regulator",
"power window regulator"
],

"window motor":[
"window motor",
"power window motor"
],

"ac compressor":[
"ac compressor",
"aircon compressor"
],

"ac condenser":[
"ac condenser",
"aircon condenser"
],

"ac evaporator":[
"ac evaporator",
"evaporator coil"
],

"intercooler":[
"intercooler",
"turbo intercooler"
],

"turbocharger":[
"turbocharger",
"engine turbo"
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
PART DETECTION
===================================================== */

function detectPart(text){

const query = normalize(text)

for(const part in PARTS){

const synonyms = PARTS[part]

for(const word of synonyms){

if(query.includes(word)){
return part
}

}

}

return null

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

detectPart,
PARTS

}
