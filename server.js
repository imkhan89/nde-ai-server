require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;


/* =====================================================
FILE PATHS
===================================================== */

const INDEX_DIR = path.join(__dirname,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");


/* =====================================================
MEMORY
===================================================== */

let PRODUCT_INDEX = [];
let SESSIONS = {};


/* =====================================================
HELPERS
===================================================== */

function xmlSafe(str){

return str
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

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

loadProductIndex();


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

const match = message.match(/\b\d{6,}\b/);

return match ? match[0] : "";

}


/* =====================================================
INTENT DETECTION
===================================================== */

function detectIntent(message){

const m = message.toLowerCase();

if(m.includes("order") || m.includes("track")){
return "ORDER_TRACKING";
}

if(m.includes("delivery")){
return "DELIVERY";
}

return "PRODUCT_SEARCH";

}


/* =====================================================
VEHICLE DETECTION
===================================================== */

const MODEL_MAKE = {

corolla:"toyota",
civic:"honda",
city:"honda",
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

const PARTS=[

"brake pad",
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"radiator",
"wiper blade",
"side mirror",
"bumper"

];

function detectPart(text){

for(const p of PARTS){

if(text.includes(p)) return p;

}

return "";

}


/* =====================================================
SEARCH
===================================================== */

function searchProducts(query){

query=query.toLowerCase();

let results=[];

for(const p of PRODUCT_INDEX){

if(p.title.includes(query)){
results.push(p);
}

}

return results.slice(0,3);

}


/* =====================================================
AI ENGINE
===================================================== */

function automotiveAI(message,user){

const session = getSession(user);

/* ORDER NUMBER CHECK */

const order = detectOrderNumber(message);

if(session.state==="ORDER_TRACKING" && order){

return `Thank you for contacting ndestore.com.

Order Number Received: ${order}

Our team is retrieving the tracking details for your order.

You will receive the tracking update shortly.`;

}

/* INTENT */

const intent = detectIntent(message);

if(intent==="ORDER_TRACKING"){

session.state="ORDER_TRACKING";

return `Thank you for contacting ndestore.com.

To check your order status kindly share your order number (e.g., #12345) and we will fetch tracking details for you.`;

}


/* PRODUCT SEARCH */

const text = message.toLowerCase();

const vehicle = detectVehicle(text);
const part = detectPart(text);

let query = [vehicle.make,vehicle.model,part]
.filter(Boolean)
.join(" ");

let reply=`Thank you for contacting ndestore.com.

Vehicle Identified
Make: ${capitalize(vehicle.make) || "Not Specified"}
Model: ${capitalize(vehicle.model) || "Not Specified"}
Part Requested: ${capitalize(part) || "Not Specified"}

`;

/* SEARCH */

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


/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp",(req,res)=>{

const message = req.body.Body || "";
const user = req.body.From || uid();

const reply = automotiveAI(message,user);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

});


/* =====================================================
SERVER START
===================================================== */

app.listen(PORT,()=>{

console.log("Automotive AI Server Running on Port",PORT);

});
