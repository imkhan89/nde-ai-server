/* =====================================================
NDESTORE AUTOMOTIVE AI ENGINE v2
High Accuracy Global Vehicle + Part Detection
===================================================== */


/* =====================================================
TYPO ENGINE
===================================================== */

const TYPO_FIXES = {

corola:"corolla",
civc:"civic",
break:"brake",
breaks:"brake",
filtr:"filter",
fiter:"filter",
miror:"mirror",
bumpr:"bumper",
disk:"disc"

};


/* =====================================================
VEHICLE ALIASES
===================================================== */

const VEHICLE_ALIASES = {

reborn:"civic",
rebirth:"civic",

gli:"corolla",
grande:"corolla",

vigo:"hilux",
revo:"hilux",

wagonr:"wagon r",

lc:"land cruiser"

};


/* =====================================================
VEHICLE DATABASE
(Scalable to 500+ models)
===================================================== */

const VEHICLE_DB = {

toyota:[
"corolla","camry","yaris","vitz","aqua","prius","hilux","fortuner",
"land cruiser","prado","raize","passo","rush","probox","premio","mark x"
],

honda:[
"civic","city","accord","vezel","brv","hrv","jazz","fit"
],

suzuki:[
"alto","mehran","cultus","swift","wagon r","bolan","every","ciaz"
],

daihatsu:[
"mira","move","cuore","boon","terios"
],

nissan:[
"dayz","note","juke","wingroad","micra"
],

mitsubishi:[
"lancer","mirage","pajero"
],

hyundai:[
"tucson","elantra","sonata","santro"
],

kia:[
"sportage","picanto","rio","cerato"
]

};


/* =====================================================
BUILD MODEL → MAKE MAP AUTOMATICALLY
===================================================== */

const MODEL_TO_MAKE = {};

for(const make in VEHICLE_DB){

VEHICLE_DB[make].forEach(model=>{

MODEL_TO_MAKE[model] = make;

});

}


/* =====================================================
PART SYNONYM ENGINE
===================================================== */

const PART_SYNONYMS = {

"disc pad":"brake pad",
"disk pad":"brake pad",
"break pad":"brake pad",
"brake pads":"brake pad",

"brake disc":"brake rotor",
"disc rotor":"brake rotor",

"air cleaner":"air filter",
"engine air filter":"air filter",

"oil filtr":"oil filter",
"engine oil filter":"oil filter",

"ac filter":"cabin filter",
"aircon filter":"cabin filter",

"plug":"spark plug",
"plugs":"spark plug",
"iridium plug":"spark plug",

"coolant":"radiator coolant",

"wipers":"wiper blade",

"head lamp":"headlight",
"tail lamp":"tail light",

"door mirror":"side mirror",
"wing mirror":"side mirror",

"bonnet":"hood",

"engine cover":"engine shield",

"car mat":"floor mat",
"boot mat":"trunk mat",

"sunshade":"sun shade"

};


/* =====================================================
MAIN PART DATABASE
===================================================== */

const PARTS = [

"brake pad",
"brake rotor",
"brake shoe",

"air filter",
"oil filter",
"cabin filter",

"spark plug",

"radiator",
"radiator cap",
"radiator coolant",

"horn",

"wiper blade",

"engine shield",
"fender shield",

"floor mat",
"trunk mat",

"sun shade",

"car top cover",

"bumper",
"front bumper",
"rear bumper",

"headlight",
"tail light",
"fog light",

"side mirror",

"emblem",
"monogram",

"car decal"

];


/* =====================================================
APPLICATION KEYWORDS
===================================================== */

const APPLICATIONS = [
"front","rear","left","right","upper","lower"
];


/* =====================================================
TEXT NORMALIZER
===================================================== */

function normalize(text){

let t = text.toLowerCase();

/* typo fixes */

for(const k in TYPO_FIXES){

t = t.replace(new RegExp(`\\b${k}\\b`,"g"),TYPO_FIXES[k]);

}

/* vehicle aliases */

for(const k in VEHICLE_ALIASES){

t = t.replace(new RegExp(`\\b${k}\\b`,"g"),VEHICLE_ALIASES[k]);

}

/* part synonyms */

for(const k in PART_SYNONYMS){

t = t.replace(new RegExp(`\\b${k}\\b`,"g"),PART_SYNONYMS[k]);

}

return t
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

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

const regex = new RegExp(`\\b${model}\\b`);

if(regex.test(text)){

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

const SORTED_PARTS = [...PARTS].sort((a,b)=>b.length-a.length);

function detectParts(text){

let found=[];

for(const p of SORTED_PARTS){

const regex = new RegExp(`\\b${p}\\b`);

if(regex.test(text)){

found.push(p);

}

}

return found;

}


/* =====================================================
APPLICATION DETECTION
===================================================== */

function detectApplication(text){

for(const a of APPLICATIONS){

const regex = new RegExp(`\\b${a}\\b`);

if(regex.test(text)) return a;

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

let query = q.join(" ");

if(query.length < 3){

query = normalize(message);

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
CAPITALIZE HELPER
===================================================== */

function cap(str){

if(!str) return "Not Specified";

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}


/* =====================================================
MAIN AI ANALYZER
===================================================== */

function analyzeAutomotiveQuery(message){

const clean = normalize(message);

const vehicle = detectVehicle(clean);

const year = detectYear(clean);

const parts = detectParts(clean);

const application = detectApplication(clean);

const query = buildQuery(
vehicle.make,
vehicle.model,
year,
parts,
application,
message
);

return {

make:cap(vehicle.make),
model:cap(vehicle.model),
year:year || "Not Specified",
part:parts.length ? cap(parts[0]) : "Not Specified",
application:cap(application),
query,
url:buildSearchURL(query)

};

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

analyzeAutomotiveQuery

};
