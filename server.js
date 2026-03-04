require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;


/* =====================
PRODUCT INDEX
===================== */

let PRODUCT_INDEX = [];

async function loadProducts(){

try{

console.log("Loading Shopify catalog...");

async function loadProducts(){

try{

console.log("Loading Shopify catalog...");

let allProducts = [];
let since_id = 0;

while(true){

const response = await axios.get(
`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json`,
{
params:{
limit:250,
since_id:since_id
},
headers:{
"X-Shopify-Access-Token":process.env.SHOPIFY_ADMIN_API_TOKEN
}
}
);

const products = response.data.products || [];

if(products.length === 0) break;

allProducts = allProducts.concat(products);

since_id = products[products.length - 1].id;

}

PRODUCT_INDEX = allProducts.map(p => ({
title: p.title.toLowerCase(),
handle: p.handle
}));

console.log("Total products indexed:", PRODUCT_INDEX.length);

}catch(err){

console.log("Catalog load error:", err.message);

}

}
  
/* =====================
SHOPIFY PRODUCT COUNT TEST
===================== */

app.get("/product-count", async (req,res)=>{

try{

const response = await axios.get(
`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products/count.json`,
{
headers:{
"X-Shopify-Access-Token":process.env.SHOPIFY_ADMIN_API_TOKEN
}
});

res.json(response.data);

}catch(err){

res.send(err.message);

}

});

/* =====================
HEALTH CHECK
===================== */

app.get("/", (req,res)=>{
res.send("NDE AI SERVER RUNNING");
});

app.get("/test",(req,res)=>{
res.send("Webhook reachable");
});

/* =====================
XML SAFE
===================== */

function xmlSafe(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

/* =====================
SHOPIFY SEARCH
===================== */

async function shopifySearch(vehicle){

try{

const query = vehicle.part;

const url =
`https://ndestore.com/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`;

const response = await axios.get(url);

const products =
response.data.resources.results.products || [];

if(products.length === 0) return null;

const match = products.find(p =>
p.title.toLowerCase().includes(vehicle.model.toLowerCase())
);

const product = match || products[0];

return {
title: product.title,
handle: product.handle
};

}catch(err){

console.log("Shopify error:",err.message);
return null;

}

}

/* =====================
OPENAI DETECTION
===================== */

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
content:"Extract car make model year and part. Return JSON."
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

return JSON.parse(text);

}catch(err){

console.log("OpenAI error:",err.message);

return null;

}

}

/* =====================
WHATSAPP WEBHOOK
===================== */

app.post("/whatsapp", async (req,res)=>{

console.log("TWILIO WEBHOOK HIT");
console.log(req.body);

const message = req.body.Body || "";

let reply = "";

try{

const vehicle = await detectVehicle(message);

if(vehicle){

const query =
`${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.part || ""}`;

const product = await shopifySearch(query, vehicle.model);
  
if(product){

reply =
`🚗 ${product.title}

Order here:
https://ndestore.com/products/${product.handle}

Delivery across Pakistan in 2–3 working days`;

}else{

reply =
`We could not find the exact part.

Vehicle:
${vehicle.make || ""} ${vehicle.model || ""}

Please confirm the required part.`;

}

}else{

reply =
"Please share vehicle model and required part.";

}

}catch(err){

console.log(err);

reply =
"Please share vehicle model and required part.";

}

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});

/* =====================
START SERVER
===================== */

app.listen(PORT, async () => {

console.log("Server running on port", PORT);

await loadProducts();

});
