require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOPIFY_STORE = "347657-7d.myshopify.com";
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_API = `https://${SHOPIFY_STORE}/admin/api/2023-10`;

/* =====================================================
INDEX PATHS
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

console.log("Products:",PRODUCT_INDEX.length);
console.log("Search Tokens:",Object.keys(SEARCH_INDEX).length);
console.log("Fitment Records:",Object.keys(FITMENT_INDEX).length);

}catch(err){

console.log("Index Load Error:",err.message);

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

state:"IDLE",
vehicle:null,
year:null,
part:null

};

}

return SESSIONS[user];

}

/* =====================================================
TYPO + NORMALIZATION
===================================================== */

const TYPO_FIXES = {

corola:"corolla",
civc:"civic",
break:"brake",
breaks:"brake",

"head light":"headlight",
"airfilter":"air filter",
"oilfilter":"oil filter",
"break pad":"brake pad",
"break pads":"brake pads"

};

/* =====================================================
GREETING DETECTION
===================================================== */

function isGreeting(text){

const greetings=[
"hi","hello","hey","salam","assalamualaikum",
"aoa","good morning","good evening"
];

return greetings.some(g=>text===g || text.startsWith(g+" "));

}

/* =====================================================
PARTS SYNONYM ENGINE
===================================================== */

const PART_SYNONYMS={

"brake pad":["pads","pad","disc pad","disc pads"],
"air filter":["engine filter"],
"cabin filter":["ac filter"]

};

function normalizePart(part){

if(!part) return part;

part=part.toLowerCase();

for(const p in PART_SYNONYMS){

if(PART_SYNONYMS[p].includes(part))
return p;

}

return part;

}

/* =====================================================
FITMENT INTELLIGENCE
===================================================== */

function checkFitment(vehicle,year,part){

if(!vehicle || !part) return true;

const key = `${vehicle}_${part}`.toLowerCase();

const data = FITMENT_INDEX[key];

if(!data) return true;

if(data.years && year){

return data.years.includes(parseInt(year));

}

return true;

}

/* =====================================================
SMART SEARCH ENGINE
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

if(!scores[m.id]){

scores[m.id]={product:m,score:0};

}

scores[m.id].score+=2;

}

}

/* fallback search */

if(Object.keys(scores).length===0){

for(const p of PRODUCT_INDEX){

let score=0;

for(const token of tokens){

if(p.title.toLowerCase().includes(token))
score++;

}

if(score){

scores[p.id]={product:p,score};

}

}

}

return Object.values(scores)
.sort((a,b)=>b.score-a.score)
.map(r=>r.product)
.slice(0,5);

}

/* =====================================================
ORDER NUMBER DETECTION
===================================================== */

function detectOrderNumber(message){

const match = message.match(/\d{5,}/);

return match ? match[0] : "";

}

/* =====================================================
SHOPIFY ORDER FETCH
===================================================== */

async function fetchOrder(order){

try{

const res = await axios.get(
`${SHOPIFY_API}/orders.json`,
{
headers:{
"X-Shopify-Access-Token":SHOPIFY_TOKEN
},
params:{
status:"any",
query:`name:${order}`
}
}
);

const orders=res.data.orders;

if(!orders || orders.length===0) return null;

const o=orders[0];

return{

order:o.name,
payment:o.financial_status,
status:o.fulfillment_status || "Unfulfilled"

};

}catch(err){

console.log("Shopify Error:",err.message);
return null;

}

}

/* =====================================================
MAIN AI ENGINE
===================================================== */

async function automotiveAI(message,user){

try{

const session=getSession(user);

let text=normalize(message);

/* GREETING */

if(isGreeting(text)){

return `Thank you for contacting ndestore.com.

Kindly share:

Vehicle Make
Vehicle Model
Model Year
Part Required

Example:
Toyota Corolla 2015 Brake Pad`;

}

/* ORDER TRACKING */

const order=detectOrderNumber(message);

if(order){

const data=await fetchOrder(order);

if(!data){

return `Order #${order} was not located.

Kindly verify the order number.`;

}

return `Order ${data.order}

Payment Status: ${data.payment}
Fulfillment Status: ${data.status}`;

}

/* AUTOMOTIVE QUERY ANALYSIS */

const data=analyzeAutomotiveQuery(text);

/* CONTEXT MEMORY */

if(data.make) session.vehicle=data.make;
if(data.year) session.year=data.year;
if(data.part) session.part=data.part;

session.part=normalizePart(session.part);

/* FITMENT CHECK */

if(!checkFitment(session.vehicle,session.year,session.part)){

return `The requested part does not appear compatible with the selected vehicle.

Kindly verify vehicle details.`;

}

/* SEARCH */

const query=`${session.vehicle||""} ${session.year||""} ${session.part||""}`;

const results=searchProducts(query);

if(results.length){

let list=results
.map(p=>`• ${p.title}`)
.join("\n");

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

Kindly provide additional details.`;

}catch(err){

console.log("AI Error:",err.message);

return `We are experiencing a temporary technical issue.

Kindly try again shortly.`;

}

}

/* =====================================================
ROOT
===================================================== */

app.get("/",(req,res)=>{

res.send("ndestore.com Automotive AI Running");

});

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp",async(req,res)=>{

const message=req.body.Body || "";
const user=req.body.From || uid();

const reply=await automotiveAI(message,user);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

});

/* =====================================================
SERVER START
===================================================== */

app.listen(PORT,()=>{

console.log("Automotive AI Server Running on Port",PORT);

});
