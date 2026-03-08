/* =====================================================
PARTS DICTIONARY BUILDER
Scans product catalog and builds AI-ready dictionary
===================================================== */

const fs = require("fs")

/* =====================================================
LOAD PRODUCTS
===================================================== */

const products = JSON.parse(
fs.readFileSync("./products.json","utf8")
)

/* =====================================================
NORMALIZER
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/\+/g," ")
.replace(/-/g," ")
.replace(/\//g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
KNOWN PART PATTERNS
===================================================== */

const partPatterns = {

"oil filter":{
aliases:["oil filter","engine oil filter","oilfilter"]
},

"air filter":{
aliases:["air filter","engine air filter","air cleaner"]
},

"cabin filter":{
aliases:["cabin filter","ac filter","air conditioning filter"]
},

"fuel filter":{
aliases:["fuel filter","petrol filter"]
},

"spark plug":{
aliases:["spark plug","spark plugs"]
},

"brake pad":{
aliases:["brake pad","brake pads","disc pad"]
},

"brake rotor":{
aliases:["brake rotor","brake disc","disc rotor"]
},

"brake shoe":{
aliases:["brake shoe","brake shoes"]
},

"radiator cap":{
aliases:["radiator cap","coolant cap"]
},

"coolant":{
aliases:["coolant","radiator coolant"]
},

"wiper blade":{
aliases:["wiper blade","wiper blades","windshield wiper"]
},

"horn":{
aliases:["horn","car horn"]
},

"floor mat":{
aliases:["floor mat","floor mats","car mat"]
},

"sun shade":{
aliases:["sun shade","sunshade","car sunshade"]
},

"engine shield":{
aliases:["engine shield","engine undercover","engine guard"]
},

"fender shield":{
aliases:["fender shield","fender liner","inner fender"]
},

"bumper":{
aliases:["bumper","front bumper","rear bumper"]
},

"emblem":{
aliases:["emblem","car emblem","logo emblem"]
},

"monogram":{
aliases:["monogram","car monogram"]
},

"decal":{
aliases:["decal","decal sticker","car decal"]
}

}

/* =====================================================
POSITIONS
===================================================== */

const positions=[
"front",
"rear",
"left",
"right"
]

/* =====================================================
PARTS DICTIONARY
===================================================== */

const dictionary={}

/* =====================================================
PRODUCT SCAN
===================================================== */

for(const p of products){

const title = normalize(p.title)

for(const part in partPatterns){

const config = partPatterns[part]

for(const alias of config.aliases){

if(title.includes(alias)){

if(!dictionary[part]){

dictionary[part]={
aliases:new Set(),
position:""
}

}

/* store aliases */

dictionary[part].aliases.add(alias)

/* detect position */

for(const pos of positions){

if(title.includes(pos)){

dictionary[part].position=pos

}

}

}

}

}

}

/* =====================================================
CONVERT SET → ARRAY
===================================================== */

for(const part in dictionary){

dictionary[part].aliases = [...dictionary[part].aliases]

}

/* =====================================================
SAVE FILE
===================================================== */

fs.writeFileSync(
"./parts_dictionary.json",
JSON.stringify(dictionary,null,2)
)

console.log("Parts dictionary generated successfully.")
