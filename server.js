require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");

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
FILE PATHS
===================================================== */

const INDEX_DIR = path.join(__dirname,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");
const SEARCH_INDEX_FILE = path.join(INDEX_DIR,"search_index.json");

/* =====================================================
MEMORY
===================================================== */

let PRODUCT_INDEX = [];
let SEARCH_INDEX = {};
let SESSIONS = {};

/* =====================================================
HELPERS
===================================================== */

function xmlSafe(str){
return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function capitalize(s){
if(!s) return "";
return s.charAt(0).toUpperCase()+s.slice(1);
}

function uid(){
return crypto.randomBytes(6).toString("hex");
}

/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

function loadProductIndex(){

try{

if(fs.existsSync(PRODUCT_INDEX_FILE)){

PRODUCT_INDEX = JSON.parse(
fs.readFileSync(PRODUCT_INDEX_FILE,"utf8")
);

console.log("Products loaded:",PRODUCT_INDEX.length);

}

}catch(e){

console.log("Index load error:",e.message);

}

}

/* =====================================================
LOAD SEARCH INDEX
===================================================== */

function loadSearchIndex(){

try{

if(fs.existsSync(SEARCH_INDEX_FILE)){

SEARCH_INDEX = JSON.parse(
fs.readFileSync(SEARCH_INDEX_FILE,"utf8")
);

console.log("Search index loaded");

}

}catch(e){

console.log("Search index error:",e.message);

}

}

loadProductIndex();
loadSearchIndex();

/* =====================================================
SESSION
===================================================== */

function getSession(user){

if(!SESSIONS[user]){

SESSIONS[user]={

state:"IDLE",
vehicle:null

};

}

return SESSIONS[user];

}

/* =====================================================
ORDER NUMBER DETECTION
===================================================== */

function detectOrderNumber(message){

const match = message.match(/\d{6,}/);

return match ? match[0] : "";

}

/* =====================================================
SHOPIFY ORDER FETCH
===================================================== */

async function getShopifyOrder(orderNumber){

try{

const res = await axios.get(
`${SHOPIFY_API}/orders.json`,
{
headers:{
"X-Shopify-Access-Token": SHOPIFY_TOKEN
},
params:{
status:"any",
query:`name:${orderNumber}`
}
}
);

const orders = res.data.orders;

if(!orders || orders.length===0){
return null;
}

const order = orders[0];

let tracking="Not available";
let courier="Not available";
let tracking_url="";

if(order.fulfillments && order.fulfillments.length){

const f = order.fulfillments[0];

tracking = f.tracking_number || "Not available";
courier = f.tracking_company || "Not available";
tracking_url = f.tracking_url || "";

}

return {

order:order.name,
payment:order.financial_status,
fulfillment:order.fulfillment_status || "Unfulfilled",
courier,
tracking,
tracking_url

};

}catch(err){

console.log("Shopify API Error:",err.message);
return null;

}

}

/* =====================================================
INTENT DETECTION
===================================================== */

function detectIntent(message){

const m = message.toLowerCase().trim();

if(
m==="hi" ||
m==="hello" ||
m==="hey" ||
m==="salam" ||
m==="assalamualaikum" ||
m==="aoa" ||
m.includes("good morning") ||
m.includes("good evening")
){
return "GREETING";
}

if(m.includes("order") || m.includes("track")){
return "ORDER_TRACKING";
}

if(m.includes("delivery") || m.includes("shipping")){
return "DELIVERY";
}

return "PRODUCT_SEARCH";

}

/* =====================================================
VEHICLE DETECTION
===================================================== */

const MODEL_MAKE = {

corolla:"toyota",
camry:"toyota",
yaris:"toyota",

civic:"honda",
city:"honda",

elantra:"hyundai",
tucson:"hyundai",
sonata:"hyundai",

sportage:"kia",
picanto:"kia",

alto:"suzuki",
cultus:"suzuki",
swift:"suzuki"

};

function detectVehicle(text){

for(const model in MODEL_MAKE){

const r = new RegExp(`\\b${model}\\b`);

if(r.test(text)){

return{
make:MODEL_MAKE[model],
model
};

}

}

return{};

}

/* =====================================================
PART DETECTION
===================================================== */

const PARTS = [

"headlight",
"head lamp",
"tail light",
"tail lamp",
"fog light",
"side mirror",
"mirror",
"bumper",
"front bumper",
"rear bumper",
"grill",
"grille",
"bonnet",
"hood",
"fender",
"mudguard",
"radiator",
"radiator fan",
"brake pad",
"brake pads",
"brake disc",
"brake rotor",
"air filter",
"oil filter",
"cabin filter",
"ac filter",
"spark plug",
"coil",
"shock absorber",
"suspension",
"door handle",
"door mirror",
"wiper",
"wiper blade"

];

function detectPart(text){

text=text.toLowerCase();

for(const p of PARTS){

if(text.includes(p)) return p;

}

if(text.includes("disc pad")) return "brake pad";

return "";

}

/* =====================================================
YEAR DETECTION
===================================================== */

function detectYear(text){

const match = text.match(/\b(19|20)\d{2}\b/);

if(match){
return match[0];
}

return "";

}

/* =====================================================
TOKEN SEARCH ENGINE
===================================================== */

function searchProducts(query){

const tokens = query.toLowerCase().split(" ");

let results=[];

if(Object.keys(SEARCH_INDEX).length){

for(const t of tokens){

const matches = SEARCH_INDEX[t];

if(matches){

for(const m of matches){

results.push(m);

}

}

}

}else{

for(const p of PRODUCT_INDEX){

let score=0;

for(const t of tokens){

if(p.title.includes(t)) score++;

}

if(score>0){

results.push({
...p,
score
});

}

}

results.sort((a,b)=>b.score-a.score);

}

return results.slice(0,3);

}

/* =====================================================
AI ENGINE
===================================================== */

async function automotiveAI(message,user){

const session = getSession(user);

const order = detectOrderNumber(message);

if(session.state==="ORDER_TRACKING" && order){

const data = await getShopifyOrder(order);

if(!data){

return `Thank you for contacting ndestore.com.

Order #${order} was not found.

Please verify the order number.`;

}

let reply=`Thank you for contacting ndestore.com.

Order Details

Order Number: ${data.order}

Payment Status: ${data.payment}

Fulfillment Status: ${data.fulfillment}

Courier: ${data.courier}

Tracking Number: ${data.tracking}`;

if(data.tracking_url){

reply+=`

Track Shipment:
${data.tracking_url}`;

}

return reply;

}

const intent = detectIntent(message);

if(intent==="GREETING"){

return `Thank you for contacting ndestore.com.

Welcome to Pakistan's first AI-powered auto parts search.

Please share your vehicle model and required part.

Example:
Corolla 2015 brake pads
Civic 2018 air filter`;

}

if(intent==="ORDER_TRACKING"){

session.state="ORDER_TRACKING";

return `Thank you for contacting ndestore.com.

To check your order status kindly share your order number (e.g., #12345).`;

}

/* PRODUCT SEARCH */

const text = message.toLowerCase();

const vehicle = detectVehicle(text);
const part = detectPart(text);
const year = detectYear(text);

let query = [vehicle.make,vehicle.model,year,part]
.filter(Boolean)
.join(" ");

let reply=`Thank you for contacting ndestore.com.

Vehicle Identified
Make: ${capitalize(vehicle.make) || "Not Specified"}
Model: ${capitalize(vehicle.model) || "Not Specified"}
Model Year: ${year || "Not Specified"}
Part Requested: ${capitalize(part) || "Not Specified"}

`;

if(query){

const results = searchProducts(query);

if(results.length){

reply+="Top Products:\n\n";

for(const r of results){

reply+=`• https://www.ndestore.com/products/${r.handle}\n`;

}

}else{

reply+=`Search products here:
https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product`;

}

}

return reply;

}

app.get("/", (req, res) => {
  res.send("NDE AI WhatsApp Bot Running");
});

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

const message = req.body.Body || "";
const user = req.body.From || uid();

const reply = await automotiveAI(message,user);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

});

/* =====================================================
SERVER START
===================================================== */

app.listen(PORT,()=>{

console.log("Automotive AI Server Running on Port",PORT);

});
