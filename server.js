require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended:false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

let PRODUCT_INDEX = [];

/* =========================
LOAD SHOPIFY PRODUCTS
========================= */

async function loadProducts(){

try{

console.log("Loading Shopify catalog...");

let allProducts = [];
let since_id = 0;

while(true){

const response = await axios.get(
`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json`,
{
params:{ limit:250, since_id },
headers:{
"X-Shopify-Access-Token":process.env.SHOPIFY_ADMIN_API_TOKEN
}
}
);

const products = response.data.products || [];

if(products.length === 0) break;

allProducts = allProducts.concat(products);

since_id = products[products.length-1].id;

console.log("Products loaded:",allProducts.length);

}

PRODUCT_INDEX = allProducts.map(p=>({
title: p.title.toLowerCase(),
handle: p.handle
}));

console.log("Total products indexed:",PRODUCT_INDEX.length);

}catch(err){

console.log("Catalog load error:",err.message);

}

}

/* =========================
SMART SEARCH
========================= */

function searchProducts(message){

const words = message
.toLowerCase()
.split(/\s+/)
.filter(w => w.length > 2);

const results = PRODUCT_INDEX.filter(p => {

let score = 0;

words.forEach(word=>{
if(p.title.includes(word)) score++;
});

return score >= 2;

});

return results.slice(0,3);

}

/* =========================
OPENAI VEHICLE DETECTION
========================= */

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
content:"Extract car make model year and part as JSON. Example: {make:'Toyota',model:'Corolla',year:'2016',part:'wiper blade'}"
},
{
role:"user",
content:message
}
],
max_tokens:80
},
{
headers:{
Authorization:`Bearer ${OPENAI_KEY}`
}
}
);

let text = response.data.choices[0].message.content;

text = text.replace(/```json/g,"").replace(/```/g,"");

try{
return JSON.parse(text);
}catch{
return null;
}

}catch(err){

console.log("OpenAI error:",err.message);
return null;

}

}

/* =========================
XML SAFE
========================= */

function xmlSafe(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

/* =========================
HEALTH ROUTES
========================= */

app.get("/",(req,res)=>{
res.send("NDE AI SERVER RUNNING");
});

app.get("/test",(req,res)=>{
res.send("Webhook reachable");
});

/* =========================
WHATSAPP WEBHOOK
========================= */

app.post("/whatsapp", async (req,res)=>{

console.log("TWILIO WEBHOOK HIT");
console.log(req.body);

const message = req.body.Body || "";

let reply = "";

try{

const vehicle = await detectVehicle(message);

const results = searchProducts(message);

if(results.length > 0){

const product = results[0];

reply =
`🚗 ${product.title}

Order here:
https://ndestore.com/products/${product.handle}

Delivery across Pakistan in 2–3 working days`;

}else{

reply =
`We could not find the exact part.

Vehicle:
${vehicle?.make || ""} ${vehicle?.model || ""}

Please confirm the required part.`;

}

}catch(err){

console.log(err);

reply = "Please share vehicle model and required part.";

}

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});

/* =========================
START SERVER
========================= */

app.listen(PORT, async ()=>{

console.log("Server running on port",PORT);

await loadProducts();

});
