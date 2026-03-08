const { vehicles: VEHICLE_DB } = require("./data/vehicle_database");
const { learnQuery } = require("./learning_engine");

const GENERATIONS = require("./data/vehicle_generations");
const { resolveVehicle } = require("./fitment_engine");

/* PARSER SYSTEM */

const parse = require("./data/parser");
const { GLOBAL_PART_INDEX } = require("./data/automotive_intelligence");

/* =====================================================
MODEL INDEX BUILDER
===================================================== */

const vehicleIndex = [];
const MODEL_TO_MAKE = {};

if (Array.isArray(VEHICLE_DB)) {

VEHICLE_DB.forEach(vehicle => {

const make = (vehicle.make || "").toLowerCase();
const model = (vehicle.model || "").toLowerCase();

if(!make || !model) return;

vehicleIndex.push({
make,
model,
data: vehicle
});

MODEL_TO_MAKE[model] = make;

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

function getYearOptions(make, model){

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

let clean = normalizeText(message);

try{ learnQuery(clean); }catch(e){}

/* PARSE AUTOMOTIVE QUERY */

const parsed = parse(clean, GLOBAL_PART_INDEX);

let vehicle = parsed.vehicle || {make:"",model:""};
const year = parsed.year;
const part = parsed.part;
const application = parsed.position;

/* VEHICLE ALIAS */

const aliasVehicle = resolveVehicle(clean);

if(aliasVehicle && !vehicle.model){

vehicle.make = aliasVehicle.make.toLowerCase();
vehicle.model = aliasVehicle.model.toLowerCase();

}

/* YEAR OPTIONS */

if(vehicle.make && vehicle.model && !year){

const options = getYearOptions(vehicle.make,vehicle.model);

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

let generation = detectGeneration(vehicle.make,vehicle.model,year,clean);

if(!generation && vehicle.make && vehicle.model){

generation = resolveDefaultGeneration(vehicle.make,vehicle.model);

}

/* QUERY BUILDER */

const query=[
application,
part,
vehicle.make,
vehicle.model,
year
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

module.exports = {
analyzeAutomotiveQuery
};
