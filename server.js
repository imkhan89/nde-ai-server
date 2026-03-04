require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

/* HEALTH CHECK */

app.get("/", (req,res)=>{
res.send("NDE AI SERVER RUNNING");
});

/* TEST ROUTE */

app.get("/test",(req,res)=>{
res.send("Webhook reachable");
});

/* XML SAFE */

function xmlSafe(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

/* SHOPIFY SEARCH */

async function shopifySearch(query){

try{

const url =
`https://ndestore.com/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`;

const response = await axios.get(url);

const products =
response.data.resources.results.products || [];

if(products.length===0) return null;

const p = products[0];

return{
title:p.title,
handle:p.handle
};

}catch(err){

console.log("Shopify error:",err.message);

return null;

}

}

/* OPENAI DETECTION */

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

/* WHATSAPP WEBHOOK */

app.post("/whatsapp", async (req,res)=>{

console.log("Incoming:",req.body);

const message = (req.body.Body || "").toLowerCase();

let reply = "";

/* BASIC GREETING RESPONSE */

if(message.includes("hello") || message.includes("hi")){

reply = "Welcome to NDE Store 🚗\n\nPlease share your vehicle model and required part.";

}

/* PRODUCT SEARCH */

else{

try{

const vehicle = await detectVehicle(message);

if(vehicle && vehicle.part){

const query =
`${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.part}`;

const product =
await shopifySearch(query);

if(product){

reply = `Thank you for contacting NDE Store.

${product.title}

Order here:
https://ndestore.com/products/${product.handle}

Delivery across Pakistan in 2–3 working days.`;

}

}

}catch(err){

console.log("Webhook error:",err.message);

}

}

/* FALLBACK MESSAGE */

if(!reply){

reply = "Please share your vehicle model and required part so we can assist you.";

}

/* TWILIO RESPONSE */

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});

/* START SERVER */

app.listen(PORT,"0.0.0.0",()=>{

console.log("Server running on port",PORT);

});
