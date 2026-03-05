require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOP_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

/* --------------------------------
TYPO + SYNONYM ENGINE
-------------------------------- */

const SYNONYMS = {
corola: "corolla",
civc: "civic",
vipr: "wiper",
viper: "wiper",
break: "brake",
plug: "spark plug",
plugs: "spark plug"
};

function normalize(text){

let t = text.toLowerCase();

Object.keys(SYNONYMS).forEach(k=>{
t = t.replace(new RegExp(k,"g"), SYNONYMS[k]);
});

return t
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* --------------------------------
VEHICLE + PART DETECTION
-------------------------------- */

function detectVehicle(message){

const text = normalize(message);

const yearMatch = text.match(/\b(19|20)\d{2}\b/);
const year = yearMatch ? yearMatch[0] : "";

let make="";
let model="";
let part="";

const makes = ["toyota","honda","suzuki","kia","hyundai","mg"];

const models = [
"corolla",
"civic",
"city",
"alto",
"mehran",
"cultus"
];

const parts = [
"wiper",
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"brake pad",
"car top cover",
"sun shade",
"floor mat"
];

makes.forEach(m=>{
if(text.includes(m)) make=m;
});

models.forEach(m=>{
if(text.includes(m)) model=m;
});

parts.forEach(p=>{
if(text.includes(p)) part=p;
});

return {make,model,year,part};

}

/* --------------------------------
SEARCH QUERY BUILDER
-------------------------------- */

function buildQuery(vehicle,message){

let queryParts = [];

if(vehicle.part) queryParts.push(vehicle.part);
if(vehicle.make) queryParts.push(vehicle.make);
if(vehicle.model) queryParts.push(vehicle.model);

/* IMPORTANT
Year is NOT added to Shopify search
because products contain ranges like 2016-2021
*/

const q = queryParts.join(" ").trim();

if(q.length>3) return q;

return normalize(message);

}

/* --------------------------------
SHOPIFY SEARCH LINK
-------------------------------- */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&options%5Bprefix%5D=last`;

}

/* --------------------------------
FORMAT TEXT
-------------------------------- */

function capitalize(str){

if(!str) return "";

return str.charAt(0).toUpperCase()+str.slice(1);

}

/* --------------------------------
WHATSAPP REPLY BUILDER
-------------------------------- */

function buildReply(vehicle,query){

const url = buildSearchURL(query);

const make = capitalize(vehicle.make);
const model = capitalize(vehicle.model);
const part = capitalize(vehicle.part);

let vehicleText = `${make} ${model}`.trim();

return `Thank you for sharing an inquiry with us.

Vehicle Make: ${make || "Not specified"}
Vehicle Model: ${model || "Not specified"}
Model Year: ${vehicle.year || "Not specified"}
Part: ${part || "Automotive Part"}

Kindly visit the following website link for details:
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
