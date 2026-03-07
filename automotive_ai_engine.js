/* =====================================================
ndestore.com AUTOMOTIVE AI ENGINE
Vehicle + Generation Detection
===================================================== */

let vehicle = detectVehicle(clean);

const aliasVehicle = resolveVehicle(clean);

if(aliasVehicle){

vehicle.make = aliasVehicle.make.toLowerCase();
vehicle.model = aliasVehicle.model.toLowerCase();

}
const PARTS = require("./data/part_database");
const GENERATIONS = require("./data/vehicle_generations");

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
MODEL → MAKE MAP
===================================================== */

const MODEL_TO_MAKE = {};

for(const make in VEHICLE_DB){

VEHICLE_DB[make].forEach(model=>{

MODEL_TO_MAKE[model] = make;

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

/* apply part synonyms */

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

make:MODEL_TO_MAKE[model],
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

/* detect by alias */

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

/* detect by year */

if(year && g.years.includes(year)){

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

if(make) q.push(make);
if(model) q.push(model);
if(year) q.push(year);
if(part) q.push(part);

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

const vehicle = detectVehicle(clean);

const year = detectYear(clean);

const generation = detectGeneration(
vehicle.make,
vehicle.model,
year,
clean
);

const parts = detectParts(clean);

const application = detectApplication(clean);

const part = parts.length ? parts[0] : "";

const query = buildQuery(
vehicle.make,
vehicle.model,
year,
part
);

return {

make:cap(vehicle.make),
model:cap(vehicle.model),

generation: generation ? generation.generation : "Not Specified",

year: year || "Not Specified",

part: part ? cap(part) : "Not Specified",

application:cap(application),

query,

url: buildSearchURL(query)

};

}catch(err){

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
