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
VEHICLE GENERATION DATABASE
-------------------------------- */

const GENERATIONS = {

"civic reborn": { make:"honda", model:"civic", year:"2006-2012" },
"civic rebirth": { make:"honda", model:"civic", year:"2013-2016" },
"civic x": { make:"honda", model:"civic", year:"2017-2021" },

"corolla 2014": { make:"toyota", model:"corolla", year:"2014-2017" },
"corolla 2018": { make:"toyota", model:"corolla", year:"2018-2021" }

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

/* generation detection */

Object.keys(GENERATIONS).forEach(g=>{

if(text.includes(g)){
make = GENERATIONS[g].make;
model = GENERATIONS[g].model;
year = GENERATIONS[g].year;
}

});

/* model detection */

Object.keys(MODEL_TO_MAKE).forEach(m=>{

if(text.includes(m)){
model = m;
}

});

/* auto detect make */

if(!make && model && MODEL_TO_MAKE[model]){
make = MODEL_TO_MAKE[model];
}

/* year detection */

const yearMatch = text.match(/\b(19|20)\d{2}\b/);
if(yearMatch) year = yearMatch[0];

/* part detection */

PARTS.forEach(p=>{
if(text.includes(p)) part = p;
});

return {make,model,year,part};

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
CAPITALIZATION
-------------------------------- */

function capitalize(str){

if(!str) return "";

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}

/* --------------------------------
LEARNING LOG
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

function buildReply(vehicle,query){

const url = buildSearchURL(query);

const make = capitalize(vehicle.make);
const model = capitalize(vehicle.model);
const part = capitalize(vehicle.part);

let yearPrompt="";

if(vehicle.make && vehicle.model && !vehicle.year){

yearPrompt = `

To ensure compatibility, please confirm the vehicle model year.`;

}

return `Thank you for contacting NDE Store.

Vehicle Information Identified:

Make: ${make || "Not Specified"}
Model: ${model || "Not Specified"}
Model Year: ${vehicle.year || "Not Specified"}
Part Requested: ${part || "Automotive Part"}

You may view compatible brands and available options at the following link:

${url}${yearPrompt}

If you would like assistance selecting the most suitable option, I can connect you with our representative.`;

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

const reply = buildReply(vehicle,query);

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
