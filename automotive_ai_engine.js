const { vehicles: VEHICLE_DB } = require("./data/vehicle_database");
const { learnQuery } = require("./learning_engine");
const { detectPartsAdvanced } = require("./marketplace_intelligence");

const PARTS = require("./data/part_database");
const GENERATIONS = require("./data/vehicle_generations");

const { resolveVehicle } = require("./fitment_engine");

/* =====================================================
PART SYNONYMS
===================================================== */

const PART_SYNONYMS = {

"disc pad":"brake pad",
"disk pad":"brake pad",
"break pad":"brake pad",
"brake pads":"brake pad",

"brake disc":"brake rotor",

"air cleaner":"air filter",
"engine air filter":"air filter",

"engine oil filter":"oil filter",

"ac filter":"cabin filter",
"aircon filter":"cabin filter",

"plug":"spark plug",
"plugs":"spark plug",

"coolant":"radiator coolant",

"wipers":"wiper blade",

"door mirror":"side mirror",
"wing mirror":"side mirror",

"head lamp":"headlight",
"tail lamp":"tail light"

};

/* =====================================================
APPLICATION KEYWORDS
===================================================== */

const APPLICATIONS = [
"front","rear","left","right","upper","lower","driver","passenger"
];

/* =====================================================
MODEL INDEX BUILDER
===================================================== */

const vehicleIndex = [];
const MODEL_TO_MAKE = {};

if(Array.isArray(VEHICLE_DB)){

VEHICLE_DB.forEach(vehicle=>{

const make=(vehicle.make || "").toLowerCase();
const model=(vehicle.model || "").toLowerCase();

if(!make || !model) return;

vehicleIndex.push({
make,
model,
data:vehicle
});

MODEL_TO_MAKE[model]=make;

});

}

/* =====================================================
TEXT NORMALIZER
===================================================== */

function normalizeText(text){

return text
.toLowerCase()
.replace(/\+/g," ")
.replace(/-/g," ")
.replace(/\//g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* =====================================================
SYNONYM NORMALIZER
===================================================== */

function applySynonyms(text){

Object.entries(PART_SYNONYMS).forEach(([syn,real])=>{

const pattern=new RegExp(`\\b${syn}\\b`,"g");

text=text.replace(pattern,real);

});

return text;

}

/* =====================================================
YEAR DETECTION
===================================================== */

function detectYear(text){

const match=text.match(/\b(19|20)\d{2}\b/);

return match ? parseInt(match[0]) : null;

}

/* =====================================================
VEHICLE DETECTION
===================================================== */

function detectVehicle(text){

for(const vehicle of vehicleIndex){

const make=vehicle.make;
const model=vehicle.model;

if(!make || !model) continue;

if(text.includes(make) && text.includes(model)){

return {make,model};

}

}

return {make:"",model:""};

}

/* =====================================================
GENERATION DETECTION
===================================================== */

function detectGeneration(make,model,year,text){

for(const g of GENERATIONS){

if(g.make!==make) continue;
if(g.model!==model) continue;

if(g.aliases){

for(const a of g.aliases){

if(text.includes(a)){

return {
generation:g.generation,
years:g.years
};

}

}

}

if(year && Array.isArray(g.years) && g.years.includes(year)){

return {
generation:g.generation,
years:g.years
};

}

}

return null;

}

/* =====================================================
DEFAULT GENERATION
===================================================== */

function resolveDefaultGeneration(make,model){

for(const g of GENERATIONS){

if(g.make===make && g.model===model){

return {
generation:g.generation,
years:g.years
};

}

}

return null;

}

/* =====================================================
IMPROVED PART DETECTION
===================================================== */

function detectParts(text){

let found=[];

/* ---------- PRIORITY 1 : Exact phrase detection ---------- */

const sortedParts=[...PARTS].sort((a,b)=>b.length-a.length);

for(const part of sortedParts){

const pattern=new RegExp(`\\b${part}\\b`,"i");

if(pattern.test(text)){
found.push(part);
break;
}

}

/* ---------- PRIORITY 2 : Synonym detection ---------- */

if(!found.length){

Object.entries(PART_SYNONYMS).forEach(([syn,real])=>{

const pattern=new RegExp(`\\b${syn}\\b`,"i");

if(pattern.test(text)){
found.push(real);
}

});

}

/* ---------- PRIORITY 3 : Marketplace fallback ---------- */

if(!found.length){

try{

const advanced=detectPartsAdvanced(text);

if(Array.isArray(advanced) && advanced.length){
found=advanced;
}

}catch(e){}

}

/* ---------- FINAL CLEANUP ---------- */

found=found
.filter(Boolean)
.map(p=>p.toLowerCase())
.filter((v,i,a)=>a.indexOf(v)===i);

return found;

}

/* =====================================================
APPLICATION DETECTION
===================================================== */

function detectApplication(text){

for(const a of APPLICATIONS){

if(text.includes(a)) return a;

}

return "";

}

/* =====================================================
SEARCH URL
===================================================== */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

}

/* =====================================================
CAPITALIZATION
===================================================== */

function cap(str){

if(!str) return "Not Specified";

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}

/* =====================================================
YEAR OPTIONS
===================================================== */

function getYearOptions(make,model){

const years=[];

for(const g of GENERATIONS){

if(
g.make.toLowerCase()===make.toLowerCase() &&
g.model.toLowerCase()===model.toLowerCase()
){

if(Array.isArray(g.years) && g.years.length){

years.push(`${g.years[0]}-${g.years[g.years.length-1]}`);

}

}

}

return years;

}

/* =====================================================
MAIN ANALYZER
===================================================== */

function analyzeAutomotiveQuery(message){

try{

let clean=normalizeText(message);

clean=applySynonyms(clean);

try{ learnQuery(clean); }catch(e){}

/* VEHICLE */

let vehicle=detectVehicle(clean) || {make:"",model:""};

/* VEHICLE ALIAS */

const aliasVehicle=resolveVehicle(clean);

if(aliasVehicle && !vehicle.model){

vehicle.make=aliasVehicle.make.toLowerCase();
vehicle.model=aliasVehicle.model.toLowerCase();

}

/* YEAR */

const year=detectYear(clean);

/* YEAR OPTIONS */

if(vehicle.make && vehicle.model && !year){

const options=getYearOptions(vehicle.make,vehicle.model);

if(options.length){

return {

make:cap(vehicle.make),
model:cap(vehicle.model),
generation:"Not Specified",
year:"Select Model Year",
part:"Not Specified",
application:"",
query:"",
url:"",
yearOptions:options

};

}

}

/* GENERATION */

let generation=detectGeneration(vehicle.make,vehicle.model,year,clean);

if(!generation && vehicle.make && vehicle.model){

generation=resolveDefaultGeneration(vehicle.make,vehicle.model);

}

/* PART */

let parts=detectParts(clean);

const application=detectApplication(clean);

const part=parts.length ? parts.join(", ") : "";

/* QUERY */

const query=[
part,
vehicle.make,
vehicle.model
]
.filter(Boolean)
.join(" ");

/* RESPONSE */

return {

make:cap(vehicle.make),
model:cap(vehicle.model),

generation:generation ? generation.generation : "Not Specified",

year:year || (generation ? generation.years[0] : "Not Specified"),

part:part ? cap(part) : "Not Specified",

application:cap(application),

query,
url:buildSearchURL(query)

};

}catch(err){

console.error("AUTOMOTIVE AI ERROR:",err);

return {

make:"Not Specified",
model:"Not Specified",
generation:"Not Specified",
year:"Not Specified",
part:"Not Specified",
application:"Not Specified",
query:message,
url:buildSearchURL(message)

};

}

}

/* =====================================================
EXPORT
===================================================== */

module.exports={
analyzeAutomotiveQuery
};
