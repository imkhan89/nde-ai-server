require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");

let analyzeAutomotiveQuery = null;

try{
analyzeAutomotiveQuery = require("./automotive_ai_engine").analyzeAutomotiveQuery;
}catch(e){
console.log("Automotive AI engine not found. Using fallback AI.");
}

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const PORT = process.env.PORT || 3000;


/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const SHOPIFY_API = `https://${SHOPIFY_STORE}/admin/api/2023-10`;


/* =====================================================
INDEX FILES
===================================================== */

const INDEX_DIR = path.join(__dirname,"index");

const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");
const SEARCH_INDEX_FILE = path.join(INDEX_DIR,"search_index.json");
const FITMENT_INDEX_FILE = path.join(INDEX_DIR,"fitment_index.json");


/* =====================================================
MEMORY
===================================================== */

let PRODUCT_INDEX = [];
let SEARCH_INDEX = {};
let FITMENT_INDEX = {};
let SESSIONS = {};


/* =====================================================
LOAD INDEXES
===================================================== */

function loadIndexes(){

try{

if(fs.existsSync(PRODUCT_INDEX_FILE))
PRODUCT_INDEX = JSON.parse(fs.readFileSync(PRODUCT_INDEX_FILE,"utf8"));

if(fs.existsSync(SEARCH_INDEX_FILE))
SEARCH_INDEX = JSON.parse(fs.readFileSync(SEARCH_INDEX_FILE,"utf8"));

if(fs.existsSync(FITMENT_INDEX_FILE))
FITMENT_INDEX = JSON.parse(fs.readFileSync(FITMENT_INDEX_FILE,"utf8"));

console.log("Products Loaded:",PRODUCT_INDEX.length);
console.log("Search Tokens:",Object.keys(SEARCH_INDEX).length);

}catch(e){

console.log("Index load error:",e.message);

}

}

loadIndexes();


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
SESSION MANAGER
===================================================== */

function getSession(user){

if(!SESSIONS[user]){

SESSIONS[user]={
vehicle:null,
year:null,
part:null,
state:"IDLE",
lastIntent:null
};

}

return SESSIONS[user];

}


/* =====================================================
TEXT NORMALIZATION
===================================================== */

const TYPO_FIXES={
corola:"corolla",
civc:"civic",
break:"brake",
breaks:"brake",
airfilter:"air filter",
oilfilter:"oil filter",
head light:"headlight"
};

function normalize(text){

text=text.toLowerCase();

Object.keys(TYPO_FIXES).forEach(t=>{
text=text.replaceAll(t,TYPO_FIXES[t]);
});

return text;

}


/* =====================================================
GREETING DETECTION
===================================================== */

function isGreeting(text){

const g=[
"hi","hello","hey","salam",
"assalamualaikum","aoa",
"good morning","good evening"
];

return g.some(x=>text===x || text.startsWith(x+" "));

}


/* =====================================================
MAIN MENU
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

Reply with 1, 2, 3, 4, 5 or 6`;

}


/* =====================================================
INTENT DETECTION
===================================================== */

function detectIntent(text){

if(isGreeting(text)) return "GREETING";

if(text==="1" || text.includes("parts")) return "PARTS";

if(text==="2" || text.includes("accessories")) return "ACCESSORIES";

if(text==="3" || text.includes("order")) return "ORDER";

if(text==="4" || text.includes("complaint")) return "COMPLAINT";

if(text==="5" || text.includes("decal") || text.includes("sticker")) return "DECAL";

if(text==="6" || text.includes("other")) return "OTHER";

if(/\d{5,}/.test(text)) return "ORDER_NUMBER";

return "AUTOMOTIVE_QUERY";

}


/* =====================================================
VEHICLE EXTRACTION
===================================================== */

const VEHICLES=[
"corolla","civic","city","cultus",
"alto","mehran","yaris","swift",
"prius","revo","hilux"
];

const PARTS=[
"brake pad","air filter","oil filter",
"cabin filter","spark plug",
"radiator","horn","wiper","headlight"
];

function extractVehiclePart(text){

let vehicle="";
let year="";
let part="";

const tokens=text.split(/\s+/);

for(const t of tokens){

if(/20\d{2}/.test(t)) year=t;

if(VEHICLES.includes(t)) vehicle=t;

}

for(const p of PARTS){

if(text.includes(p)){
part=p;
break;
}

}

return{vehicle,year,part};

}


/* =====================================================
FITMENT CHECK
===================================================== */

function checkFitment(vehicle,year,part){

if(!vehicle || !part) return true;

const key=`${vehicle}_${part}`.toLowerCase();

const data=FITMENT_INDEX[key];

if(!data) return true;

if(year && data.years)
return data.years.includes(parseInt(year));

return true;

}


/* =====================================================
SEARCH ENGINE
===================================================== */

function searchProducts(query){

query=query.toLowerCase();

const tokens=query
.replace(/[^a-z0-9 ]/g," ")
.split(/\s+/)
.filter(t=>t.length>2);

let scores={};

for(const token of tokens){

const matches=SEARCH_INDEX[token];

if(!matches) continue;

for(const m of matches){

if(!scores[m.id])
scores[m.id]={product:m,score:0};

scores[m.id].score+=3;

}

}

if(Object.keys(scores).length===0){

for(const p of PRODUCT_INDEX){

let score=0;

for(const t of tokens){

if(p.title.toLowerCase().includes(t))
score++;

}

if(score)
scores[p.id]={product:p,score};

}

}

return Object.values(scores)
.sort((a,b)=>b.score-a.score)
.map(r=>r.product)
.slice(0,5);

}


/* =====================================================
SHOPIFY ORDER LOOKUP
===================================================== */

async function fetchOrder(order){

try{

const res=await axios.get(`${SHOPIFY_API}/orders.json`,{
headers:{
"X-Shopify-Access-Token":SHOPIFY_TOKEN
},
params:{
status:"any",
query:`name:${order}`
}
});

const orders=res.data.orders;

if(!orders.length) return null;

const o=orders[0];

return{
order:o.name,
payment:o.financial_status,
status:o.fulfillment_status || "Unfulfilled"
};

}catch(e){

console.log("Shopify error:",e.message);
return null;

}

}


/* =====================================================
MAIN AI ENGINE
===================================================== */

async function automotiveAI(message,user){

const session=getSession(user);

let text=normalize(message);

const intent=detectIntent(text);


/* GREETING */

if(intent==="GREETING"){
session.state="MENU";
return mainMenu();
}


/* MENU ROUTES */

if(intent==="PARTS" || intent==="ACCESSORIES"){

session.state="PART_REQUEST";

return `Kindly share

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Toyota Corolla 2018 Air Filter`;

}


if(intent==="ORDER"){
return `Please share your order number

Example
10011421`;
}


if(intent==="COMPLAINT"){
return `Please describe your complaint.

If related to an order kindly share your order number`;
}


if(intent==="DECAL"){
return `Please share your vehicle details and decal requirement.

Example
Toyota Corolla 2018 TRD Sticker`;
}


if(intent==="OTHER"){
return `Kindly share

Name
Contact Number
Your inquiry`;
}


/* ORDER LOOKUP */

const orderMatch=message.match(/\d{5,}/);

if(orderMatch){

const orderData=await fetchOrder(orderMatch[0]);

if(!orderData)
return `Order not located. Kindly verify order number`;

return `Order Number: ${orderData.order}

Payment Status: ${orderData.payment}
Fulfillment Status: ${orderData.status}`;

}


/* AUTOMOTIVE QUERY */

let data={};

if(analyzeAutomotiveQuery){
data=analyzeAutomotiveQuery(text);
}

const backup=extractVehiclePart(text);

if(!data.make && backup.vehicle) data.make=backup.vehicle;
if(!data.year && backup.year) data.year=backup.year;
if(!data.part && backup.part) data.part=backup.part;

if(data.make) session.vehicle=data.make;
if(data.year) session.year=data.year;
if(data.part) session.part=data.part;


/* FITMENT */

if(!checkFitment(session.vehicle,session.year,session.part)){

return `The requested part does not appear compatible with the selected vehicle`;

}


/* SEARCH */

const query=`${session.vehicle || ""} ${session.year || ""} ${session.part || ""}`;

const results=searchProducts(query);


if(results.length){

const list=results.map(p=>{

const url=p.handle
? `https://${SHOPIFY_STORE.replace(".myshopify.com",".com")}/products/${p.handle}`
: "";

return `• ${p.title}
${url}`;

}).join("\n");


return `Vehicle Identified
Make: ${session.vehicle}
Year: ${session.year}
Part: ${session.part}

Matching Products
${list}

Best Regards
ndestore.com`;

}


return `No matching products found.

Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Honda Civic 2017 Brake Pad`;

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

console.log("Webhook Error:",e.message);

res.send(`<Response><Message>System temporarily unavailable.</Message></Response>`);

}

});


/* =====================================================
HEALTH CHECK
===================================================== */

app.get("/",(req,res)=>{
res.send("ndestore AI Engine Running");
});


/* =====================================================
SERVER START
===================================================== */

app.listen(PORT,()=>{
console.log("AI Server Running on Port",PORT);
});
