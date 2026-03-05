/* =========================================================
NDESTORE AUTOMOTIVE AI ENGINE
Global Vehicle Detection + Product Search
========================================================= */


/* =========================================================
TYPO ENGINE
========================================================= */

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


/* =========================================================
VEHICLE ALIASES
========================================================= */

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


/* =========================================================
MODEL → MAKE DATABASE
========================================================= */

const MODEL_TO_MAKE = {

/* Toyota */

corolla:"toyota",
camry:"toyota",
yaris:"toyota",
vitz:"toyota",
aqua:"toyota",
prius:"toyota",
hilux:"toyota",
fortuner:"toyota",
landcruiser:"toyota",
"land cruiser":"toyota",
prado:"toyota",
raize:"toyota",
passo:"toyota",
rush:"toyota",
probox:"toyota",
premio:"toyota",
markx:"toyota",

/* Honda */

civic:"honda",
city:"honda",
accord:"honda",
vezel:"honda",
brv:"honda",
hrv:"honda",
jazz:"honda",
fit:"honda",

/* Suzuki */

alto:"suzuki",
mehran:"suzuki",
cultus:"suzuki",
swift:"suzuki",
"wagon r":"suzuki",
bolan:"suzuki",
every:"suzuki",
ciaz:"suzuki",

/* Daihatsu */

mira:"daihatsu",
move:"daihatsu",
cuore:"daihatsu",
boon:"daihatsu",
terios:"daihatsu",

/* Nissan */

dayz:"nissan",
note:"nissan",
juke:"nissan",
wingroad:"nissan",
micra:"nissan",

/* Mitsubishi */

lancer:"mitsubishi",
mirage:"mitsubishi",
pajero:"mitsubishi",

/* Hyundai */

tucson:"hyundai",
elantra:"hyundai",
sonata:"hyundai",
santro:"hyundai",

/* Kia */

sportage:"kia",
picanto:"kia",
rio:"kia",
cerato:"kia",

};


/* =========================================================
PART SYNONYM ENGINE (ndestore priority)
========================================================= */

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

"plugs":"spark plug",
"plug":"spark plug",

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

"sunshade":"sun shade",

};


/* =========================================================
NDESTORE MAIN PART LIST
========================================================= */

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


/* =========================================================
APPLICATION KEYWORDS
========================================================= */

const APPLICATIONS = [

"front",
"rear",
"left",
"right",
"upper",
"lower"

];


/* =========================================================
TEXT NORMALIZER
========================================================= */

function normalize(text){

let t = text.toLowerCase();

/* Fix typos */

for(const k in TYPO_FIXES){
t = t.replace(new RegExp(`\\b${k}\\b`,"g"),TYPO_FIXES[k]);
}

/* Fix vehicle aliases */

for(const k in VEHICLE_ALIASES){
if(t.includes(k)){
t = t.replace(k,VEHICLE_ALIASES[k]);
}
}

/* Fix part synonyms */

for(const k in PART_SYNONYMS){
if(t.includes(k)){
t = t.replace(k,PART_SYNONYMS[k]);
}
}

return t
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}


/* =========================================================
VEHICLE DETECTION
========================================================= */

function detectVehicle(text){

let make="";
let model="";

for(const m in MODEL_TO_MAKE){

if(text.includes(m)){

model=m;
make=MODEL_TO_MAKE[m];
break;

}

}

return {make,model};

}


/* =========================================================
PART DETECTION
========================================================= */

function detectPart(text){

for(const p of PARTS){

if(text.includes(p)) return p;

}

return "";

}


/* =========================================================
APPLICATION DETECTION
========================================================= */

function detectApplication(text){

for(const a of APPLICATIONS){

if(text.includes(a)) return a;

}

return "";

}


/* =========================================================
QUERY BUILDER
========================================================= */

function buildQuery(make,model,part,application,message){

let q=[];

if(make) q.push(make);
if(model) q.push(model);
if(part) q.push(part);
if(application) q.push(application);

let query=q.join(" ");

if(query.length<3){
query=normalize(message);
}

return query;

}


/* =========================================================
SEARCH URL
========================================================= */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

}


/* =========================================================
CAPITALIZE HELPER
========================================================= */

function cap(str){

if(!str) return "Not Specified";

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}


/* =========================================================
MAIN AI ANALYZER
========================================================= */

function analyzeAutomotiveQuery(message){

const clean = normalize(message);

const vehicle = detectVehicle(clean);

const part = detectPart(clean);

const application = detectApplication(clean);

const query = buildQuery(
vehicle.make,
vehicle.model,
part,
application,
message
);

const url = buildSearchURL(query);

return {

make: cap(vehicle.make),
model: cap(vehicle.model),
part: cap(part),
application: cap(application),
query,
url

};

}


/* =========================================================
EXPORT
========================================================= */

module.exports = {

analyzeAutomotiveQuery

};
