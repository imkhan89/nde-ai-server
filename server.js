import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const openai = new OpenAI({ apiKey: OPENAI_KEY });

/* SESSION MEMORY */

const sessions = {};

/* XML SAFE */

function escapeXml(str){
return str.replace(/[<>&'"]/g,c=>({
"<":"&lt;",
">":"&gt;",
"&":"&amp;",
"'":"&apos;",
'"':"&quot;"
}[c]));
}

/* HEALTH */

app.get("/",(req,res)=>{
res.send("API SERVER RUNNING");
});

/* SUPPORT */

function supportReplies(msg){

msg = msg.toLowerCase();

if(msg.includes("delivery"))
return "Delivery takes 2–3 working days across Pakistan.";

if(msg.includes("payment"))
return "We offer Cash on Delivery (COD) nationwide.";

if(msg.includes("return"))
return "Returns accepted within 7 days if unused.";

return null;

}

/* VEHICLE DETECTION */

async function detectVehicle(message){

try{

const ai = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages:[
{
role:"system",
content:`Extract vehicle info.

Return JSON only:

{
"brand":"",
"model":"",
"year":"",
"part":""
}`
},
{role:"user",content:message}
],

max_tokens:80
});

return JSON.parse(ai.choices[0].message.content);

}
catch{
return null;
}

}

/* SHOPIFY SEARCH */

async function searchShopify(query){

try{

const url =
`https://${SHOP}/admin/api/2024-01/products.json?limit=100`;

const r = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":TOKEN
},
timeout:5000
});

const products = r.data.products || [];

const q = query.toLowerCase();

const match = products.find(p =>
p.title.toLowerCase().includes(q)
);

if(!match) return null;

return {
title:match.title,
price:match.variants?.[0]?.price,
handle:match.handle
};

}
catch{
return null;
}

}

/* SALES RESPONSE */

function salesMessage(product){

return `Thank you for contacting NDE Store.

${product.title}

Price: PKR ${product.price}

You can order here:
https://ndestore.com/products/${product.handle}

Delivery across Pakistan within 2–3 working days.

If you need assistance selecting the correct part please share your vehicle model and year.`;

}

/* WEBHOOK */

app.post("/webhook", async (req,res)=>{

const msg = req.body.Body || "";
const sender = req.body.From || "";

if(!sessions[sender]){
sessions[sender]={};
}

let reply = "Please share your vehicle model and required part.";

try{

/* SUPPORT */

const support = supportReplies(msg);

if(support){
reply = support;
}

/* VEHICLE AI */

const v = await detectVehicle(msg);

if(v){

if(v.brand) sessions[sender].brand=v.brand;
if(v.model) sessions[sender].model=v.model;
if(v.part) sessions[sender].part=v.part;
if(v.year) sessions[sender].year=v.year;

}

/* YEAR DETECTION */

const year = msg.match(/\b(19|20)\d{2}\b/);

if(year){
sessions[sender].year = year[0];
}

/* SESSION */

const s = sessions[sender];

if(s.model && s.part){

const query = `${s.model} ${s.part}`;

const product = await searchShopify(query);

if(product){

reply = salesMessage(product);

}
else{

reply = `Thank you for your message.

Please confirm the model year of your ${s.model} so we can recommend the correct ${s.part}.`;

}

}

}
catch(e){
reply = "Thank you for contacting NDE Store. Please share your vehicle model and required part.";
}

const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${escapeXml(reply)}</Message>
</Response>`;

res.set("Content-Type","text/xml");
res.send(twiml);

});

/* START */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});
