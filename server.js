require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOP_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

let PRODUCTS = [];

/* =========================================================
LOAD COMPLETE SHOPIFY CATALOG
========================================================= */

async function loadProducts() {

try {

console.log("Loading Shopify catalog...");

let since_id = 0;
let allProducts = [];

while (true) {

const response = await axios.get(
`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`,
{
params: { limit: 250, since_id },
headers: { "X-Shopify-Access-Token": SHOP_TOKEN }
}
);

const products = response.data.products || [];

if (!products.length) break;

allProducts = allProducts.concat(products);

since_id = products[products.length - 1].id;

console.log("Products loaded:", allProducts.length);

}

PRODUCTS = allProducts.map(p => {

const description = (p.body_html || "").replace(/<[^>]*>/g,"");

const variants = p.variants || [];

return {

title: (p.title || "").toLowerCase(),
handle: p.handle,
description: description.toLowerCase(),
tags: (p.tags || "").toLowerCase(),
vendor: (p.vendor || "").toLowerCase(),
sku: variants.map(v => v.sku || "").join(" ").toLowerCase()

};

});

console.log("Catalog indexed:", PRODUCTS.length);

} catch (err) {

console.log("Catalog load error:", err.message);

}

}

/* =========================================================
TEXT UTILITIES
========================================================= */

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

/* =========================================================
SMART PRODUCT SEARCH ENGINE
Search title + description + tags + SKU
========================================================= */

function searchProducts(message){

const query = normalize(message);

const words = query.split(" ");

let bestScore = 0;
let bestProduct = null;

for (const p of PRODUCTS){

let score = 0;

for (const w of words){

if (p.title.includes(w)) score += 5;

if (p.description.includes(w)) score += 2;

if (p.tags.includes(w)) score += 2;

if (p.vendor.includes(w)) score += 1;

if (p.sku.includes(w)) score += 4;

}

if (score > bestScore){

bestScore = score;
bestProduct = p;

}

}

return bestProduct;

}

/* =========================================================
AI CUSTOMER INTENT DETECTION
========================================================= */

async function detectIntent(message){

if (!OPENAI_KEY) return "product";

try{

const response = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:"Classify message intent. Return only one word: product, order, support, unclear"
},
{
role:"user",
content:message
}
],
max_tokens:5
},
{
headers:{
Authorization:`Bearer ${OPENAI_KEY}`
}
}
);

return response.data.choices[0].message.content.trim().toLowerCase();

}catch{

return "product";

}

}

/* =========================================================
AI VEHICLE + PART EXTRACTION
========================================================= */

async function detectVehicle(message){

if (!OPENAI_KEY) return null;

try{

const response = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:"Extract make, model, year and part from message. Return JSON only."
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

return JSON.parse(text);

}catch{

return null;

}

}

/* =========================================================
WHATSAPP WEBHOOK
========================================================= */

app.post("/whatsapp", async (req,res)=>{

const message=(req.body.Body || "").trim();

console.log("Customer:",message);

let reply="";

try{

const intent = await detectIntent(message);

/* =========================
PRODUCT INQUIRY
========================= */

if (intent==="product"){

const vehicle = await detectVehicle(message);

let query="";

if(vehicle){

query=`${vehicle.part || ""} ${vehicle.make || ""} ${vehicle.model || ""}`.trim();

}

if(!query){

query=message;

}

const result = searchProducts(query);

if(result){

const url = buildSearchURL(query);

reply =
`Thank you for inquiry with us.

For more information about the requested product kindly visit the following website link:

${url}`;

}else{

reply =
`Thank you for contacting us.

To assist you accurately kindly confirm the following details:

Vehicle Make
Vehicle Model
Vehicle Year
Required Part`;

}

}

/* =========================
ORDER SUPPORT
========================= */

else if(intent==="order"){

reply =
`Thank you for contacting us.

Kindly share your order number so we may check the order status and update you accordingly.`;

}

/* =========================
CUSTOMER SUPPORT
========================= */

else if(intent==="support"){

reply =
`Thank you for contacting us.

Kindly share further details regarding your concern so we may assist you accordingly.`;

}

/* =========================
UNCLEAR MESSAGE
========================= */

else{

reply =
`Thank you for contacting us.

Kindly confirm the vehicle model and required part so we may guide you accordingly.`;

}

}catch{

reply =
`Thank you for contacting us.

Kindly confirm the vehicle model and required part so we may guide you accordingly.`;

}

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");

res.send(twiml);

});

/* =========================================================
UTILITY ROUTES
========================================================= */

app.get("/",(req,res)=>{

res.send("NDE ENTERPRISE AI SERVER RUNNING");

});

app.get("/catalog-size",(req,res)=>{

res.json({products:PRODUCTS.length});

});

/* =========================================================
START SERVER
========================================================= */

app.listen(PORT, async ()=>{

console.log("Server running on port",PORT);

await loadProducts();

});
