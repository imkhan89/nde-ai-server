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
corola:"corolla",
civc:"civic",
vipr:"wiper",
viper:"wiper",
break:"brake",
breaks:"brake",
plug:"spark plug",
plugs:"spark plug",
filtr:"filter",
fiter:"filter"
};

function normalize(text){

let t = text.toLowerCase();

Object.keys(SYNONYMS).forEach(k=>{
t = t.replace(new RegExp(`\\b${k}\\b`,"g"),SYNONYMS[k]);
});

return t
.replace(/[^\w\s.]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* --------------------------------
MODEL → MAKE DATABASE
-------------------------------- */

const MODEL_TO_MAKE = {

corolla:"toyota",
yaris:"toyota",
hilux:"toyota",
revo:"toyota",

civic:"honda",
city:"honda",

alto:"suzuki",
mehran:"suzuki",
cultus:"suzuki",
swift:"suzuki",
"wagon r":"suzuki",

sportage:"kia",
tucson:"hyundai"

};

/* --------------------------------
VEHICLE GENERATION DATABASE
-------------------------------- */

const GENERATIONS = {

"civic reborn":{make:"honda",model:"civic",year:"2006-2012"},
"civic rebirth":{make:"honda",model:"civic",year:"2013-2016"},
"civic x":{make:"honda",model:"civic",year:"2017-2021"}

};

/* --------------------------------
PART DATABASE
-------------------------------- */

const PARTS=[

"wiper",
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"brake pad",
"brake disc",
"radiator coolant",
"radiator cap",
"horn",
"engine shield",
"fender shield"

];

/* --------------------------------
APPLICATION POSITION
-------------------------------- */

const APPLICATION=[

"left",
"right",
"front",
"rear",
"upper",
"lower"

];

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
DETECT VEHICLE
-------------------------------- */

function detectVehicle(message){

const text = normalize(message);

let make="";
let model="";
let part="";
let year="";
let application="";

/* generation detection */

Object.keys(GENERATIONS).forEach(g=>{

if(text.includes(g)){
make=GENERATIONS[g].make;
model=GENERATIONS[g].model;
year=GENERATIONS[g].year;
}

});

/* model detection */

Object.keys(MODEL_TO_MAKE).forEach(m=>{
if(text.includes(m)) model=m;
});

/* auto make */

if(!make && model && MODEL_TO_MAKE[model]){
make=MODEL_TO_MAKE[model];
}

/* year */

const yearMatch=text.match(/\b(19|20)\d{2}\b/);
if(yearMatch) year=yearMatch[0];

/* part */

PARTS.forEach(p=>{
if(text.includes(p)) part=p;
});

/* application */

APPLICATION.forEach(a=>{
if(text.includes(a)) application=a;
});

return {make,model,year,part,application};

}

/* --------------------------------
SEARCH QUERY
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
SEARCH LINK
-------------------------------- */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

}

/* --------------------------------
INTENT DETECTION
-------------------------------- */

function detectIntent(text){

if(text.includes("order status") ||
   text.includes("delivery status") ||
   text.includes("where is my order"))
return "order";

if(text.includes("complaint") ||
   text.includes("problem") ||
   text.includes("issue"))
return "complaint";

if(text.includes("feature") ||
   text.includes("specification") ||
   text.includes("details"))
return "product_info";

return "product_search";

}

/* --------------------------------
REPLY BUILDER
-------------------------------- */

function buildReply(vehicle,query,message){

const text = normalize(message);
const intent = detectIntent(text);
const url = buildSearchURL(query);

const make = capitalize(vehicle.make);
const model = capitalize(vehicle.model);
const part = capitalize(vehicle.part);
const application = capitalize(vehicle.application);

/* ORDER STATUS */

if(intent==="order"){

return `Thank you for contacting ndestore.com.

To check the delivery status of your order, please share your order number.

Our customer service team will assist you with the latest order update.`;

}

/* COMPLAINT */

if(intent==="complaint"){

return `Thank you for contacting ndestore.com.

We regret the inconvenience.

Kindly share the following information so we can assist you:

Order Number
Complaint Description

Our customer service representative will review the matter and respond shortly.`;

}

/* PRODUCT INFORMATION */

if(intent==="product_info"){

return `Thank you for contacting ndestore.com.

For detailed product information including specifications, compatibility, and features, please visit:

${url}

If you need technical guidance selecting the correct product, please share your vehicle details.`;

}

/* PART SEARCH */

let applicationPrompt="";

if(vehicle.part && !vehicle.application){

applicationPrompt=` 

Kindly confirm the application if applicable (Left / Right / Front / Rear / Upper / Lower).`;

}

let yearPrompt="";

if(vehicle.make && vehicle.model && !vehicle.year){

yearPrompt=` 

Kindly confirm the vehicle model year to ensure compatibility.`;

}

return `Thank you for contacting ndestore.com kindly note the following:

Make: ${make || "Not Specified"}
Model: ${model || "Not Specified"}
Model Year: ${vehicle.year || "Not Specified"}
Part Requested: ${part || "Automotive Part"}

Website Link: ${url}${applicationPrompt}${yearPrompt}

If you would like further assistance share detailed inquiry.`;

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

const message=(req.body.Body || "").trim();

const vehicle=detectVehicle(message);

const query=buildQuery(vehicle,message);

const reply=buildReply(vehicle,query,message);

const twiml=`<?xml version="1.0" encoding="UTF-8"?>
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
