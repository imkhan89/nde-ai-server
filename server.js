require("dotenv").config();

const express = require("express");
const app = express();

/* Twilio sends URL encoded data */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;


/* =====================================================
TYPO + WORD NORMALIZATION
===================================================== */

const TYPO_FIXES = {
corola:"corolla",
civc:"civic",
break:"brake",
breaks:"brake",
bumpr:"bumper",
miror:"mirror",
filtr:"filter",
fiter:"filter",
disk:"disc"
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
"disc rotor":"brake rotor",

"air cleaner":"air filter",
"engine air filter":"air filter",

"oil filtr":"oil filter",
"engine oil filter":"oil filter",

"ac filter":"cabin filter",
"aircon filter":"cabin filter",

"plug":"spark plug",
"plugs":"spark plug",

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
MODEL → MAKE DATABASE
===================================================== */

const MODEL_TO_MAKE = {

corolla:"toyota",
camry:"toyota",
yaris:"toyota",
vitz:"toyota",
aqua:"toyota",
prius:"toyota",
hilux:"toyota",
fortuner:"toyota",
"land cruiser":"toyota",
prado:"toyota",

civic:"honda",
city:"honda",
accord:"honda",

alto:"suzuki",
mehran:"suzuki",
cultus:"suzuki",
swift:"suzuki",
"wagon r":"suzuki",

mira:"daihatsu",

dayz:"nissan",

sportage:"kia",

tucson:"hyundai"

};


/* =====================================================
PART DATABASE
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

"bumper",
"front bumper",
"rear bumper",

"headlight",
"tail light",
"fog light",

"side mirror",

"car decal"

];


/* =====================================================
APPLICATION KEYWORDS
===================================================== */

const APPLICATIONS = ["front","rear","left","right"];


/* =====================================================
TEXT NORMALIZATION
===================================================== */

function normalize(text){

let t=(text||"").toLowerCase();

for(const k in TYPO_FIXES){
t=t.replace(new RegExp(`\\b${k}\\b`,"g"),TYPO_FIXES[k]);
}

for(const k in VEHICLE_ALIASES){
if(t.includes(k)){
t=t.replace(k,VEHICLE_ALIASES[k]);
}
}

for(const k in PART_SYNONYMS){
if(t.includes(k)){
t=t.replace(k,PART_SYNONYMS[k]);
}
}

return t
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}


/* =====================================================
VEHICLE DETECTION
===================================================== */

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


/* =====================================================
PART DETECTION
===================================================== */

function detectPart(text){

for(const p of PARTS){

if(text.includes(p)){
return p;
}

}

return "";

}


/* =====================================================
APPLICATION DETECTION
===================================================== */

function detectApplication(text){

for(const a of APPLICATIONS){

if(text.includes(a)){
return a;
}

}

return "";

}


/* =====================================================
QUERY BUILDER
===================================================== */

function buildQuery(vehicle,part,application,message){

const q=[];

if(vehicle.make) q.push(vehicle.make);
if(vehicle.model) q.push(vehicle.model);
if(part) q.push(part);
if(application) q.push(application);

const query=q.join(" ");

if(query.length>3) return query;

return normalize(message);

}


/* =====================================================
SEARCH URL
===================================================== */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

}


/* =====================================================
XML SAFE
===================================================== */

function xmlSafe(text){

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}


/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp",(req,res)=>{

console.log("Incoming message:",req.body);

const message=(req.body.Body || "").trim();

const text=normalize(message);

const vehicle=detectVehicle(text);

const part=detectPart(text);

const application=detectApplication(text);

const query=buildQuery(vehicle,part,application,message);

const url=buildSearchURL(query);

let reply=`Thank you for contacting ndestore.com kindly note the following:

Make: ${vehicle.make || "Not Specified"}
Model: ${vehicle.model || "Not Specified"}
Model Year: Not Specified
Part Requested: ${part || "Automotive Part"}

Website Link:
${url}

If you would like further assistance share detailed inquiry.`;


const twiml=`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});


/* =====================================================
SERVER START
===================================================== */

app.listen(PORT,()=>{

console.log("NDE AI Server running on port:",PORT);

});
