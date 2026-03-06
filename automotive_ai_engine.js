/* =====================================================
ndestore.com AUTOMOTIVE AI ENGINE (ERROR SAFE)
Uses external vehicle and part databases
===================================================== */

const VEHICLE_DB = require("./data/vehicle_database");
const PARTS = require("./data/part_database");

/* =====================================================
VEHICLE ALIASES
===================================================== */

const VEHICLE_ALIASES = {

reborn:"civic",
rebirth:"civic",

gli:"corolla",
altis:"corolla",
grande:"corolla",

vigo:"hilux",
revo:"hilux",

wagonr:"wagon r",

lc:"land cruiser"

};

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
BUILD MODEL → MAKE MAP
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

/* apply vehicle aliases */

for(const alias in VEHICLE_ALIASES){

const r = new RegExp(`\\b${alias}\\b`,"g");

t = t.replace(r,VEHICLE_ALIASES[alias]);

}

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

return match ? match[0] : "";

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
PART DETECTION
===================================================== */

function detectParts(text){

let found=[];

for(const key in PART_SYNONYMS){

if(text.includes(key)){
text=text.replace(key,PART_SYNONYMS[key]);
}

}

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

function buildQuery(make,model,year,parts,application,message){

let q=[];

if(make) q.push(make);
if(model) q.push(model);
if(year) q.push(year);

if(parts.length) q.push(parts[0]);

if(application) q.push(application);

let query=q.join(" ");

if(query.length<3){

query=normalize(message);

}

return query;

}

/* =====================================================
SEARCH URL BUILDER
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

const clean=normalize(message);

const vehicle=detectVehicle(clean);

const year=detectYear(clean);

const parts=detectParts(clean);

const application=detectApplication(clean);

const query=buildQuery(
vehicle.make,
vehicle.model,
year,
parts,
application,
message
);

return{

make:cap(vehicle.make),
model:cap(vehicle.model),
year:year || "Not Specified",
part:parts.length ? cap(parts[0]) : "Not Specified",
application:cap(application),
query,
url:buildSearchURL(query)

};

}catch(err){

return{

make:"Not Specified",
model:"Not Specified",
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
