require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOP_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

let PRODUCTS = [];

/* ------------------------------------------------
AUTOMOTIVE GENERATION DATABASE
------------------------------------------------ */

const GENERATIONS = {
"honda civic":[
{gen:"reborn",start:2006,end:2011},
{gen:"rebirth",start:2012,end:2015},
{gen:"civic x",start:2016,end:2021},
{gen:"civic fe",start:2022,end:2030}
],
"toyota corolla":[
{gen:"e140",start:2008,end:2013},
{gen:"e170",start:2014,end:2020},
{gen:"e210",start:2021,end:2030}
]
};

/* ------------------------------------------------
AI SYNONYM + TYPO ENGINE
------------------------------------------------ */

const SYNONYMS = {
"corola":"corolla",
"civc":"civic",
"vipr":"wiper",
"viper":"wiper",
"break":"brake",
"car cover":"car top cover",
"top cover":"car top cover"
};

function normalize(text){

let t = text.toLowerCase();

Object.keys(SYNONYMS).forEach(k=>{
t = t.replace(new RegExp(k,"g"),SYNONYMS[k]);
});

return t
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* ------------------------------------------------
SHOPIFY PRODUCT LOADER (50k SAFE)
------------------------------------------------ */

async function loadProducts(){

let since_id = 0;

while(true){

const res = await axios.get(
`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`,
{
params:{limit:250,since_id},
headers:{"X-Shopify-Access-Token":SHOP_TOKEN}
}
);

const items = res.data.products || [];

if(!items.length) break;

since_id = items[items.length-1].id;

items.forEach(p=>{

const desc = (p.body_html||"").replace(/<[^>]*>/g,"");

PRODUCTS.push({
title:(p.title||"").toLowerCase(),
description:desc.toLowerCase(),
tags:(p.tags||"").toLowerCase(),
vendor:(p.vendor||"").toLowerCase(),
handle:p.handle
});

});

console.log("Products indexed:",PRODUCTS.length);

}

}

/* ------------------------------------------------
VEHICLE INTELLIGENCE
------------------------------------------------ */

function detectVehicle(message){

const text = normalize(message);

const yearMatch = text.match(/\b(19|20)\d{2}\b/);
const year = yearMatch ? parseInt(yearMatch[0]) : null;

let make="",model="",part="";

["toyota","honda","suzuki","kia","hyundai","mg"].forEach(m=>{
if(text.includes(m)) make=m;
});

["corolla","civic","city","mehran","alto","cultus"].forEach(m=>{
if(text.includes(m)) model=m;
});

[
"wiper",
"air filter",
"oil filter",
"brake pad",
"car top cover",
"sun shade",
"floor mat"
].forEach(p=>{
if(text.includes(p)) part=p;
});

return {make,model,year,part};

}

/* ------------------------------------------------
GENERATION DETECTION
------------------------------------------------ */

function generation(make,model,year){

if(!year) return "";

const key = `${make} ${model}`;

const list = GENERATIONS[key];

if(!list) return "";

for(const g of list){

if(year>=g.start && year<=g.end){
return g.gen;
}

}

return "";

}

/* ------------------------------------------------
YEAR RANGE DETECTION FROM TITLE
------------------------------------------------ */

function yearRangeScore(title,year){

if(!year) return 0;

const ranges = title.match(/(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}/g);

if(!ranges) return 0;

for(const r of ranges){

const y = r.match(/\d{4}/g);
const start = parseInt(y[0]);
const end = parseInt(y[1]);

if(year>=start && year<=end){
return 10;
}

}

return 0;

}

/* ------------------------------------------------
SMART PRODUCT MATCH ENGINE
------------------------------------------------ */

function searchProduct(message){

const vehicle = detectVehicle(message);

const gen = generation(vehicle.make,vehicle.model,vehicle.year);

let bestScore = 0;
let bestProduct = null;

for(const p of PRODUCTS){

let score = 0;

if(vehicle.make && p.title.includes(vehicle.make)) score+=4;
if(vehicle.model && p.title.includes(vehicle.model)) score+=4;
if(vehicle.part && p.title.includes(vehicle.part)) score+=6;

if(gen && p.title.includes(gen)) score+=5;

score += yearRangeScore(p.title,vehicle.year);

if(vehicle.part && p.description.includes(vehicle.part)) score+=2;

if(score > bestScore){
bestScore = score;
bestProduct = p;
}

}

return {vehicle,bestProduct};

}

/* ------------------------------------------------
CROSS SELL ENGINE
------------------------------------------------ */

const CROSS_SELL = {
"wiper":["windshield cleaner","glass cleaner"],
"air filter":["cabin filter","oil filter"],
"car top cover":["sun shade","floor mat"],
"brake pad":["brake rotor"]
};

function crossSell(part){

const items = CROSS_SELL[part];

if(!items) return "";

return items.join(", ");

}

/* ------------------------------------------------
SEARCH LINK
------------------------------------------------ */

function searchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&options%5Bprefix%5D=last`;

}

/* ------------------------------------------------
CONVERSION OPTIMIZED RESPONSE
------------------------------------------------ */

function replyMessage(vehicle){

const query = `${vehicle.part} ${vehicle.make} ${vehicle.model}`.trim();

const link = searchURL(query);

let msg =
`Thank you for your inquiry.

Product: ${vehicle.part || "Automotive Part"}
Vehicle: ${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.year || ""}

View options:
${link}`;

const related = crossSell(vehicle.part);

if(related){
msg += `

Related items: ${related}`;
}

return msg;

}

/* ------------------------------------------------
XML SAFE
------------------------------------------------ */

function xmlSafe(t){
return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* ------------------------------------------------
WHATSAPP WEBHOOK
------------------------------------------------ */

app.post("/whatsapp",(req,res)=>{

const message = (req.body.Body||"").trim();

const result = searchProduct(message);

const v = result.vehicle;

let reply;

if(!v.part){

reply =
`Thank you for contacting us.

Please share:
Vehicle Make
Vehicle Model
Vehicle Year
Required Part`;

}else{

reply = replyMessage(v);

}

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});

/* ------------------------------------------------
SERVER START
------------------------------------------------ */

app.listen(PORT,async()=>{

console.log("NDE Automotive AI running:",PORT);

await loadProducts();

});
