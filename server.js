require("dotenv").config();

const express = require("express");
const axios = require("axios");
const Fuse = require("fuse.js");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOP_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

/* ======================================
GLOBAL DATA
====================================== */

let PRODUCTS = [];
let fuse = null;

/* ======================================
AUTOMOTIVE DICTIONARY
====================================== */

const MAKES = [
"toyota","honda","suzuki","kia","hyundai",
"daihatsu","mitsubishi","nissan","changan",
"mg","proton","isuzu","dfsk","haval"
];

const MODELS = [
"corolla","gli","altis","xli",
"civic","reborn","rebirth",
"city","brv","hrv",
"cultus","mehran","alto","wagonr",
"swift","bolan","ravi",
"sportage","tucson",
"elantra","sonata"
];

const PARTS = [
"wiper blade","wiper","air filter",
"oil filter","cabin filter",
"brake pad","brake pads",
"brake shoe","brake rotor",
"spark plug","radiator cap",
"coolant","floor mat","sun shade"
];

/* ======================================
LOAD SHOPIFY PRODUCTS
====================================== */

async function loadProducts(){

try{

console.log("Loading Shopify catalog...");

let since_id = 0;
let allProducts = [];

while(true){

const response = await axios.get(
`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`,
{
params:{limit:250,since_id},
headers:{
"X-Shopify-Access-Token":SHOP_TOKEN
}
}
);

const products = response.data.products || [];
if(!products.length) break;

allProducts = allProducts.concat(products);

since_id = products[products.length-1].id;

console.log("Products loaded:",allProducts.length);

}

PRODUCTS = allProducts.map(p=>({
title:p.title,
handle:p.handle
}));

/* ======================================
FUSE FUZZY SEARCH
====================================== */

fuse = new Fuse(PRODUCTS,{
keys:["title"],
threshold:0.35,
ignoreLocation:true,
minMatchCharLength:3
});

console.log("Catalog indexed:",PRODUCTS.length);

}catch(err){

console.log("Catalog load error:",err.message);

}

}

/* ======================================
HELPERS
====================================== */

function normalize(text){

return text
.toLowerCase()
.replace(/[^\w\s]/gi," ")
.replace(/\s+/g," ")
.trim();

}

function xmlSafe(text){

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

function buildSearchURL(query){

const encoded = encodeURIComponent(query);

return `https://www.ndestore.com/search?q=${encoded}&options%5Bprefix%5D=last`;

}

/* ======================================
VEHICLE DETECTION USING OPENAI
====================================== */

async function detectVehicle(message){

if(!OPENAI_KEY) return null;

try{

const response = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:"Extract vehicle make model year and part. Return JSON only."
},
{
role:"user",
content:message
}
],
max_tokens:120
},
{
headers:{
Authorization:`Bearer ${OPENAI_KEY}`
}
}
);

let text=response.data.choices[0].message.content;

text=text.replace(/```json/g,"").replace(/```/g,"").trim();

const obj=JSON.parse(text);

return{
make:obj.make||"",
model:obj.model||"",
year:obj.year||"",
part:obj.part||""
};

}catch{

return null;

}

}

/* ======================================
DICTIONARY FALLBACK
====================================== */

function detectVehicleFallback(message){

const msg = normalize(message);

let make="";
let model="";
let part="";

MAKES.forEach(m=>{
if(msg.includes(m)) make=m;
});

MODELS.forEach(m=>{
if(msg.includes(m)) model=m;
});

PARTS.forEach(p=>{
if(msg.includes(p)) part=p;
});

const yearMatch = msg.match(/\b(19|20)\d{2}\b/);

return{
make,
model,
year:yearMatch?yearMatch[0]:"",
part
};

}

/* ======================================
FUZZY SEARCH CORRECTION
====================================== */

function fuzzyMatch(message){

if(!fuse) return message;

const result = fuse.search(message);

if(!result.length) return message;

return result[0].item.title;

}

/* ======================================
BUILD SEARCH QUERY
====================================== */

function buildQuery(vehicle,message){

let query="";

if(vehicle){

query=`${vehicle.part} ${vehicle.make} ${vehicle.model}`.trim();

}

if(!query){

query=fuzzyMatch(message);

}

return normalize(query);

}

/* ======================================
WHATSAPP WEBHOOK
====================================== */

app.post("/whatsapp", async (req,res)=>{

const message=(req.body.Body||"").trim();

console.log("Customer:",message);

let vehicle=null;
let query="";

try{

vehicle = await detectVehicle(message);

if(!vehicle){

vehicle = detectVehicleFallback(message);

}

query = buildQuery(vehicle,message);

}catch{

query = normalize(message);

}

const url = buildSearchURL(query);

const reply =
`Thank you for inquiry with us.

For more information about the requested product kindly visit the following website link:

${url}`;

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});

/* ======================================
UTILITY ROUTES
====================================== */

app.get("/",(req,res)=>{

res.send("NDE ENTERPRISE AI SERVER RUNNING");

});

app.get("/catalog-size",(req,res)=>{

res.json({
products:PRODUCTS.length
});

});

/* ======================================
START SERVER
====================================== */

app.listen(PORT, async()=>{

console.log("Server started on port",PORT);

await loadProducts();

});
