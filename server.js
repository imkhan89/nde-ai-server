require("dotenv").config();

const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =====================================================
CONFIG
===================================================== */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const PUBLIC_STORE = process.env.PUBLIC_STORE_DOMAIN || "www.ndestore.com";

/* =====================================================
SESSION MEMORY
===================================================== */

let SESSIONS = {};

function getSession(user){

if(!SESSIONS[user]){

SESSIONS[user]={
state:"MENU",
vehicle:null,
year:null,
part:null
};

}

return SESSIONS[user];

}

/* =====================================================
HELPERS
===================================================== */

function uid(){
return crypto.randomBytes(6).toString("hex");
}

function xmlSafe(str){

return str
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

/* =====================================================
GREETING DETECTION
===================================================== */

function isGreeting(text){

const greetings=[
"hi","hello","hey","salam",
"assalamualaikum","aoa",
"good morning","good evening"
];

return greetings.some(g=>text===g || text.startsWith(g+" "));

}

/* =====================================================
MENU
===================================================== */

function mainMenu(){

return `Thank you for contacting ndestore.com

How can we assist you today?

1 Parts Inquiry
2 Car Accessories
3 Order Status
4 Complaints
5 Decal Stickers
6 Other

Reply with 1 2 3 4 5 or 6`;

}

/* =====================================================
AUTOMOTIVE KNOWLEDGE BASE
===================================================== */

const VEHICLES=[
"corolla","civic","city","cultus",
"alto","mehran","yaris","swift",
"revo","hilux","prius"
];

const PARTS=[
"brake pad","air filter","oil filter",
"cabin filter","spark plug",
"radiator","horn","wiper",
"headlight","fuel pump",
"alternator","fan belt",
"clutch plate"
];

/* =====================================================
EXTRACT VEHICLE + PART
===================================================== */

function extractVehicle(text){

let model="";
let year="";
let part="";

const yearMatch=text.match(/20\d{2}/);
if(yearMatch) year=yearMatch[0];

VEHICLES.forEach(v=>{
if(text.includes(v)) model=v;
});

PARTS.forEach(p=>{
if(text.includes(p)) part=p;
});

return {model,year,part};

}

/* =====================================================
SEARCH PRODUCTS
===================================================== */

function searchProducts(model,year,part){

const handle=`${part.replace(" ","-")}-${model}`;

return [
{
title:`${model} ${year} ${part}`,
handle:handle
}
];

}

/* =====================================================
ORDER LOOKUP
===================================================== */

async function fetchOrder(order){

try{

const url=`https://${SHOPIFY_STORE}/admin/api/2023-10/orders.json`;

const res=await axios.get(url,{
headers:{
"X-Shopify-Access-Token":SHOPIFY_TOKEN
},
params:{
status:"any",
query:`name:${order}`
}
});

if(!res.data.orders.length) return null;

const o=res.data.orders[0];

return{
id:o.name,
status:o.fulfillment_status || "Unfulfilled",
tracking:o.fulfillments?.[0]?.tracking_number || "In Process",
courier:o.fulfillments?.[0]?.tracking_company || "In Process"
};

}catch(e){

console.log("Shopify error:",e.message);
return null;

}

}

/* =====================================================
DECAL LINKS
===================================================== */

const DECAL_LINKS={
1:"https://www.ndestore.com/collections/stickers-decal",
2:"https://www.ndestore.com/collections/sticker-decal-army-theme",
3:"https://www.ndestore.com/collections/legal-professional-lawyer",
4:"https://www.ndestore.com/collections/decal-sticker-doctor-medic-hospital-dentist",
5:"https://www.ndestore.com/collections/markhor-stickers",
6:"https://www.ndestore.com/collections/hunter-stickers",
7:"https://www.ndestore.com/collections/toyota-decals",
8:"https://www.ndestore.com/collections/teq-series-decal-jdm-japan",
9:"https://www.ndestore.com/collections/honda-stickers",
10:"https://www.ndestore.com/collections/sports-mind-sticker/SPORTS-MIND-STICKER",
11:"https://www.ndestore.com/collections/door-paint-sticker-car-protection/DOOR-SILL-STICKER",
12:"https://www.ndestore.com/collections/sticker-jeep",
13:"https://www.ndestore.com/collections/sticker-decal-toyota-gazoo-racing-gr",
14:"https://www.ndestore.com/collections/firearm-stickers",
15:"https://www.ndestore.com/pages/custom-decal-and-sticker"
};

/* =====================================================
AI ENGINE
===================================================== */

async function automotiveAI(message,user){

const session=getSession(user);

const text=message.toLowerCase().trim();

/* GREETING */

if(isGreeting(text)){
session.state="MENU";
return mainMenu();
}

/* MENU */

if(session.state==="MENU"){

if(text==="1" || text==="2"){

session.state="PART_REQUEST";

return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Honda Civic 2017 Brake Pad`;

}

if(text==="3"){

session.state="ORDER";

return `Please share your order number`;

}

if(text==="4"){

session.state="COMPLAINT";

return `Please share order number and complaint`;

}

if(text==="5"){

session.state="DECAL";

return `Select a number between 1 and 15 for decal collection`;

}

if(text==="6"){

return `Contact us

Whatsapp +92-321-4222294
Landline +92-423-7724222
Email info@ndestore.com`;

}

return mainMenu();

}

/* PART SEARCH */

if(session.state==="PART_REQUEST"){

const data=extractVehicle(text);

if(!data.model || !data.part){

return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required`;

}

const results=searchProducts(data.model,data.year,data.part);

const list=results.map(p=>{

return `Option
${p.title}
https://${PUBLIC_STORE}/products/${p.handle}`;

}).join("\n\n");

session.state="END";

return `Vehicle Identified
Model ${data.model}
Year ${data.year}
Part ${data.part}

Matching Products

${list}

If you want to connect with a live agent let us know

Yes
No`;

}

/* ORDER */

if(session.state==="ORDER"){

const orderMatch=message.match(/\d{5,}/);

if(!orderMatch){
return `Please provide a valid order number`;
}

const order=await fetchOrder(orderMatch[0]);

if(!order){
return `Order not located`;
}

session.state="END";

return `Order ID ${order.id}

Status ${order.status}

Tracking ${order.tracking}

Courier ${order.courier}`;

}

/* COMPLAINT */

if(session.state==="COMPLAINT"){

const ticket="TKT-"+Math.floor(Math.random()*90000+10000);

session.state="END";

return `Complaint Registered

Ticket ${ticket}

Our representative will contact you shortly`;

}

/* DECALS */

if(session.state==="DECAL"){

if(DECAL_LINKS[text]){

return `Kindly visit

${DECAL_LINKS[text]}`;

}

return `Please choose number between 1 and 15`;

}

return mainMenu();

}

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp",async(req,res)=>{

try{

const message=req.body.Body || "";
const user=req.body.From || uid();

const reply=await automotiveAI(message,user);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

}catch(e){

console.log(e);

res.send(`<Response><Message>System temporarily unavailable</Message></Response>`);

}

});

/* =====================================================
SERVER
===================================================== */

app.get("/",(req,res)=>{
res.send("ndestore AI Engine Running");
});

app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});
