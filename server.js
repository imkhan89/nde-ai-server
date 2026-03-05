require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
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

/* Toyota */

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
fit:"honda",
jazz:"honda",

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
cerato:"kia"

};


/* =====================================================
NDESTORE PART DATABASE
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
"front",
"rear",
"left",
"right",
"upper",
"lower"
];


/* =====================================================
ORDER KEYWORDS
===================================================== */

const ORDER_KEYWORDS = [
"order status",
"where is my order",
"track order",
"delivery status"
];


/* =====================================================
COMPLAINT KEYWORDS
===================================================== */

const COMPLAINT_KEYWORDS = [
"complaint",
"wrong item",
"damaged",
"refund",
"return"
];


/* =====================================================
TEXT NORMALIZATION
===================================================== */

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
INTENT DETECTION
===================================================== */

function detectIntent(message){

const text=normalize(message);

for(const k of ORDER_KEYWORDS){
if(text.includes(k)) return "order";
}

for(const k of COMPLAINT_KEYWORDS){
if(text.includes(k)) return "complaint";
}

return "product";

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
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp",(req,res)=>{

const message=(req.body.Body || "").trim();

const intent=detectIntent(message);

let reply="";


if(intent==="order"){

reply=`Thank you for contacting ndestore.com.

To check your delivery status kindly share your order number.

Our team will review the order and provide an update shortly.`;

}

else if(intent==="complaint"){

reply=`Thank you for contacting ndestore.com.

We are sorry to hear about the issue.

Kindly share:

Order Number
Complaint Description

Our support team will review the matter and assist you accordingly.`;

}

else{

const text=normalize(message);

const vehicle=detectVehicle(text);

const part=detectPart(text);

const application=detectApplication(text);

const query=buildQuery(vehicle,part,application,message);

const url=buildSearchURL(query);

reply=`Thank you for contacting ndestore.com kindly note the following:

Make: ${cap(vehicle.make)}
Model: ${cap(vehicle.model)}
Model Year: Not Specified
Part Requested: ${cap(part)}

Website Link:
${url}

If you would like further assistance share detailed inquiry.`;

}


const twiml=`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${reply}</Message>
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
