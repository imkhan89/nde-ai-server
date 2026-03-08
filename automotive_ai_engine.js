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
VEHICLE_DB.forEach(vehicle => {

const make = (vehicle.make || "").toLowerCase();
const model = (vehicle.model || "").toLowerCase();

vehicleIndex.push({
make,
model,
data: vehicle
});

if(model){
MODEL_TO_MAKE[model] = make;
}

});
}

/* =====================================================
TEXT NORMALIZER
===================================================== */

function normalize(text){

if(!text) return "";

let t = text.toLowerCase();

t = t.replace(/[^\w\s]/g," ");
t = t.replace(/\s+/g," ").trim();

for(const key in PART_SYNONYMS){

const r = new RegExp(`\\b${key}\\b`,"g");
t = t.replace(r,PART_SYNONYMS[key]);

}

return t;

}

/* =====================================================
YEAR DETECTION
===================================================== */

function detectYear(text){

const match = text.match(/\b(19|20)\d{2}\b/);

return match ? parseInt(match[0]) : null;

}

/* =====================================================
VEHICLE DETECTION
===================================================== */

function detectVehicle(text){

for(const model in MODEL_TO_MAKE){

const r = new RegExp(`\\b${model}\\b`);

if(r.test(text)){

return {
make: MODEL_TO_MAKE[model],
model
};

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
PART DETECTION
===================================================== */

function detectParts(text){

let found=[];

for(const part of PARTS){

if(text.includes(part)){
found.push(part);
}

}

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
QUERY BUILDER
===================================================== */

function buildQuery(make,model,year,part){

let q=[];

if(part){

const parts = part.split(",");

parts.forEach(p=>{
q.push(p.trim());
});

}

if(make) q.push(make);
if(model) q.push(model);
if(year) q.push(year);

return q.join(" ");

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
MAIN ANALYZER
===================================================== */

function analyzeAutomotiveQuery(message){

try{

const clean = normalize(message);

try{
learnQuery(clean);
}catch(e){}

/* VEHICLE */

let vehicle = detectVehicle(clean) || {make:"",model:""};

/* ALIAS */

const aliasVehicle = resolveVehicle(clean);

if(aliasVehicle && !vehicle.model){

vehicle.make = aliasVehicle.make.toLowerCase();
vehicle.model = aliasVehicle.model.toLowerCase();

}

/* YEAR */

const year = detectYear(clean);

/* GENERATION */

let generation = detectGeneration(
vehicle.make,
vehicle.model,
year,
clean
);

if(!generation && vehicle.make && vehicle.model){

generation = resolveDefaultGeneration(
vehicle.make,
vehicle.model
);

}

/* PART */

let parts = detectParts(clean);

if(!Array.isArray(parts) || !parts.length){
parts = detectPartsAdvanced(clean);
}

if(!Array.isArray(parts)){
parts=[];
}

const application = detectApplication(clean);

const part = parts.length ? parts.join(", ") : "";

/* QUERY */

const query = buildQuery(
vehicle.make || "",
vehicle.model || "",
year || "",
part || ""
);

/* RESPONSE */

return {

make: cap(vehicle.make),
model: cap(vehicle.model),

generation: generation ? generation.generation : "Not Specified",

year: year || (generation ? generation.years[0] : "Not Specified"),

part: part ? cap(part) : "Not Specified",

application: cap(application),

query,
url: buildSearchURL(query)

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
