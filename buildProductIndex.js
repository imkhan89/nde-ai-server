/* =====================================================
ndestore.com GLOBAL AUTOMOTIVE AI ENGINE v4
Expanded Automotive Intelligence Engine
Broad Typo Handling
Large Vehicle Recognition
Advanced Part Recognition
Error Safe
===================================================== */

/* =====================================================
ADVANCED TEXT NORMALIZER
===================================================== */

function normalize(text){

if(!text) return "";

let t = text.toLowerCase();

/* remove punctuation */

t = t.replace(/[^\w\s]/g," ");

/* collapse spaces */

t = t.replace(/\s+/g," ").trim();

/* common typo normalization */

t = t
.replace(/corola/g,"corolla")
.replace(/civc/g,"civic")
.replace(/break/g,"brake")
.replace(/miror/g,"mirror")
.replace(/bumpr/g,"bumper")
.replace(/filtr/g,"filter")
.replace(/fiter/g,"filter")
.replace(/disk/g,"disc");

/* normalize synonyms */

t = t
.replace(/disc pad/g,"brake pad")
.replace(/disk pad/g,"brake pad")
.replace(/brake pads/g,"brake pad")
.replace(/air cleaner/g,"air filter")
.replace(/engine air filter/g,"air filter")
.replace(/ac filter/g,"cabin filter")
.replace(/aircon filter/g,"cabin filter")
.replace(/door mirror/g,"side mirror")
.replace(/wing mirror/g,"side mirror")
.replace(/head lamp/g,"headlight")
.replace(/tail lamp/g,"tail light");

return t;

}

/* =====================================================
GLOBAL VEHICLE DATABASE
===================================================== */

const VEHICLE_DB = {

toyota:[
"corolla","camry","yaris","vitz","aqua","prius","hilux","fortuner",
"land cruiser","prado","raize","rush","premio","mark x","chr"
],

honda:[
"civic","city","accord","vezel","brv","hrv","jazz","fit","crv"
],

suzuki:[
"alto","mehran","cultus","swift","wagon r","bolan","every","ciaz"
],

hyundai:[
"elantra","sonata","tucson","santa fe","santro","accent"
],

kia:[
"sportage","picanto","rio","cerato","sorento"
],

nissan:[
"note","juke","micra","sunny","xtrail"
],

mitsubishi:[
"lancer","mirage","pajero","outlander"
],

daihatsu:[
"mira","move","boon","terios"
],

bmw:[
"3 series","5 series","7 series","x1","x3","x5"
],

mercedes:[
"c class","e class","s class","gla","glc","gle"
],

audi:[
"a3","a4","a5","a6","q3","q5"
]

};

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
AUTOMOTIVE PART DATABASE
===================================================== */

const PARTS = [

"brake pad",
"brake rotor",
"brake disc",
"brake shoe",

"air filter",
"oil filter",
"cabin filter",

"spark plug",
"ignition coil",

"radiator",
"radiator cap",
"radiator fan",
"radiator coolant",

"alternator",
"starter motor",
"fuel pump",

"wiper blade",

"engine shield",
"fender shield",

"floor mat",
"trunk mat",

"sun shade",
"car top cover",

"front bumper",
"rear bumper",
"bumper",

"headlight",
"tail light",
"fog light",

"side mirror",

"emblem",
"monogram",

"car decal"

];

/* =====================================================
PART SYNONYMS
===================================================== */

const PART_SYNONYMS = {

"disc pad":"brake pad",
"disk pad":"brake pad",
"break pad":"brake pad",

"brake discs":"brake rotor",

"air cleaner":"air filter",
"engine air filter":"air filter",

"engine oil filter":"oil filter",

"ac filter":"cabin filter",

"plug":"spark plug",
"plugs":"spark plug",

"coolant":"radiator coolant",

"wipers":"wiper blade",

"bonnet":"hood"

};

/* =====================================================
APPLICATION KEYWORDS
===================================================== */

const APPLICATIONS = [
"front","rear","left","right","upper","lower","driver","passenger"
];

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

for(const alias in VEHICLE_ALIASES){

if(text.includes(alias)){
text = text.replace(alias,VEHICLE_ALIASES[alias]);
}

}

for(const model in MODEL_TO_MAKE){

if(text.includes(model)){

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
TITLE FORMAT
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

module.exports={

analyzeAutomotiveQuery

};
