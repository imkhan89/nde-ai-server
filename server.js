require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

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

const query =
`${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.part || ""}`;

const url =
`https://ndestore.com/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`;

const response = await axios.get(url);

const products =
response.data.resources.results.products || [];

if(products.length === 0) return null;

const year = parseInt(vehicle.year);

/* FILTER BY MODEL + YEAR */

const match = products.find(p => {

const title = p.title.toLowerCase();

if(!title.includes(vehicle.model.toLowerCase())) return false;

const yearMatch = title.match(/\((\d{4})-(\d{4})\)/);

if(!yearMatch) return true;

const start = parseInt(yearMatch[1]);
const end = parseInt(yearMatch[2]);

return year >= start && year <= end;

});

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

app.listen(PORT,"0.0.0.0",()=>{

console.log("Server running on port",PORT);

});
