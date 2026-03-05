require("dotenv").config();

const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* --------------------------------
TYPO + SYNONYM ENGINE
-------------------------------- */

const SYNONYMS = {
corola: "corolla",
civc: "civic",
vipr: "wiper",
viper: "wiper",
break: "brake",
breaks: "brake",
plug: "spark plug",
plugs: "spark plug",
filtr: "filter",
fiter: "filter"
};

function normalize(text){

let t = text.toLowerCase();

Object.keys(SYNONYMS).forEach(k=>{
t = t.replace(new RegExp(`\\b${k}\\b`, "g"), SYNONYMS[k]);
});

return t
.replace(/[^\w\s.]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* --------------------------------
MODEL → MAKE MAPPING
-------------------------------- */

const MODEL_TO_MAKE = {

corolla: "toyota",
yaris: "toyota",
revo: "toyota",
hilux: "toyota",

civic: "honda",
city: "honda",

alto: "suzuki",
mehran: "suzuki",
cultus: "suzuki",
swift: "suzuki",
"wagon r": "suzuki",

sportage: "kia",

tucson: "hyundai"

};

/* --------------------------------
GENERATION DETECTION
-------------------------------- */

const GENERATIONS = {

"civic reborn": {make:"honda",model:"civic",year:"2006-2012"},
"civic rebirth": {make:"honda",model:"civic",year:"2013-2016"},
"civic x": {make:"honda",model:"civic",year:"2017-2021"}

};

/* --------------------------------
PART DATABASE
-------------------------------- */

const PARTS = [

"wiper",
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"brake pad",
"brake disc",
"radiator coolant",
"radiator cap",
"car top cover",
"sun shade",
"floor mat",
"horn",
"engine shield",
"fender shield"

];

/* --------------------------------
VEHICLE DETECTION
-------------------------------- */

function detectVehicle(message){

const text = normalize(message);

let make="";
let model="";
let part="";
let year="";
let engine="";

/* generation detection */

Object.keys(GENERATIONS).forEach(g=>{

if(text.includes(g)){

make = GENERATIONS[g].make;
model = GENERATIONS[g].model;
year = GENERATIONS[g].year;

}

});

/* year detection */

const yearMatch = text.match(/\b(19|20)\d{2}\b/);
if(yearMatch) year = yearMatch[0];

/* engine detection */

const engineMatch = text.match(/\b\d\.\d\b/);
if(engineMatch) engine = engineMatch[0];

/* model detection */

Object.keys(MODEL_TO_MAKE).forEach(m=>{

if(text.includes(m)) model = m;

});

/* auto detect make */

if(!make && model && MODEL_TO_MAKE[model]){

make = MODEL_TO_MAKE[model];

}

/* part detection */

PARTS.forEach(p=>{

if(text.includes(p)) part = p;

});

return {make,model,year,engine,part};

}

/* --------------------------------
SEARCH QUERY BUILDER
-------------------------------- */

function buildQuery(vehicle,message){

let q=[];

if(vehicle.make) q.push(vehicle.make);
if(vehicle.model) q.push(vehicle.model);
if(vehicle.part) q.push(vehicle.part);

if(q.length>1) return q.join(" ");

return normalize(message);

}

/* --------------------------------
SHOPIFY SEARCH URL
-------------------------------- */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

}

/* --------------------------------
CAPITALIZE TEXT
-------------------------------- */

function capitalize(str){

if(!str) return "";

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}

/* --------------------------------
TECHNICAL QUESTION DETECTION
-------------------------------- */

function detectTechnical(text){

const keywords=[
"best",
"recommend",
"difference",
"which",
"quality",
"original",
"genuine"
];

return keywords.some(k=>text.includes(k));

}

/* --------------------------------
AI LEARNING LOG
-------------------------------- */

function learn(query){

try{

fs.appendFileSync(
"ai_learning_log.json",
JSON.stringify({query,date:new Date()})+"\n"
);

}catch(e){}

}

/* --------------------------------
REPLY BUILDER
-------------------------------- */

function buildReply(vehicle,query,message){

const url = buildSearchURL(query);

const make = capitalize(vehicle.make);
const model = capitalize(vehicle.model);
const part = capitalize(vehicle.part);

const text = normalize(message);

/* expert mode */

if(detectTechnical(text)){

return `Thank you for contacting NDE Store.

Our automotive specialists recommend selecting high-quality OEM or premium aftermarket parts for durability and performance.

For ${make || ""} ${model || ""} ${part || "automotive parts"}, please review the available brands and choose according to your preference.

View available options here:

${url}

If you would like a specific recommendation, kindly confirm:

• Vehicle Model Year
• Engine Size`;

}

/* ask for year if missing */

let yearPrompt="";

if(vehicle.make && vehicle.model && !vehicle.year){

yearPrompt=`

To help us ensure compatibility, kindly confirm the vehicle model year.
Example:
2013
2016
2019`;

}

return `Thank you for sharing an inquiry with us.

Vehicle Make: ${make || "Not Specified"}
Vehicle Model: ${model || "Not Specified"}
Model Year: ${vehicle.year || "Not Specified"}
Engine: ${vehicle.engine || "Not Specified"}
Part: ${part || "Automotive Part"}${yearPrompt}

Kindly visit the following link to view compatible options, brands, and prices:

${url}`;

}

/* --------------------------------
XML SAFE
-------------------------------- */

function xmlSafe(text){

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

/* --------------------------------
WHATSAPP WEBHOOK
-------------------------------- */

app.post("/whatsapp",(req,res)=>{

const message = (req.body.Body || "").trim();

learn(message);

const vehicle = detectVehicle(message);

const query = buildQuery(vehicle,message);

const reply = buildReply(vehicle,query,message);

const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");

res.send(twiml);

});

/* --------------------------------
SERVER START
-------------------------------- */

app.listen(PORT,()=>{

console.log("NDE AI Server running:",PORT);

});
