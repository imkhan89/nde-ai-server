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
INDEX FILES
===================================================== */

const INDEX_DIR = path.join(__dirname,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");

/* =====================================================
MEMORY
===================================================== */

let PRODUCT_INDEX = [];
let SESSIONS = {};

/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

function loadProductIndex(){

try{

if(fs.existsSync(PRODUCT_INDEX_FILE)){

PRODUCT_INDEX = JSON.parse(
fs.readFileSync(PRODUCT_INDEX_FILE,"utf8")
);

console.log("Products Loaded:",PRODUCT_INDEX.length);

}

}catch(err){

console.log("Index Load Error:",err.message);

}

}

loadProductIndex();

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

function titleCase(str){

if(!str) return "";

return str
.split(" ")
.map(w => w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}

/* =====================================================
SESSION
===================================================== */

function getSession(user){

if(!SESSIONS[user]){

SESSIONS[user]={

state:"IDLE",
language:"EN",
customerType:"UNKNOWN"

};

}

return SESSIONS[user];

}

/* =====================================================
LANGUAGE DETECTION
===================================================== */

function detectLanguage(text){

text = text.toLowerCase();

if(
text.includes("hai") ||
text.includes("kya") ||
text.includes("kar") ||
text.includes("bhai")
){
return "UR";
}

return "EN";

}

/* =====================================================
CUSTOMER TYPE
===================================================== */

function detectCustomer(phone){

if(!phone) return "UNKNOWN";

if(phone.startsWith("whatsapp:+92") || phone.startsWith("+92")){
return "DOMESTIC";
}

return "INTERNATIONAL";

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

let tracking="Not Available";
let courier="Not Available";
let url="";

if(o.fulfillments && o.fulfillments.length){

const f=o.fulfillments[0];

tracking=f.tracking_number || tracking;
courier=f.tracking_company || courier;
url=f.tracking_url || "";

}

return{

order:o.name,
payment:o.financial_status,
status:o.fulfillment_status || "Unfulfilled",
courier,
tracking,
url

};

}catch(err){

console.log("Shopify Error:",err.message);
return null;

}

}

/* =====================================================
PRODUCT SEARCH
===================================================== */

function searchProducts(query){

query=query.toLowerCase();

let results=[];

const tokens=query.split(" ");

for(const p of PRODUCT_INDEX){

const title=p.title.toLowerCase();

let score=0;

if(title.includes(query)) score+=5;

for(const t of tokens){

if(title.includes(t)) score++;

}

if(score>0){

results.push({...p,score});

}

}

results.sort((a,b)=>b.score-a.score);

return results.slice(0,3);

}

/* =====================================================
CUSTOM DECAL FLOW
===================================================== */

function handleDecal(session){

if(session.state==="DECAL_DETAILS"){

session.state="IDLE";

return `Thank you for providing the details.

Our concerned representative will review the design and dimensions and will contact you shortly with pricing, order confirmation and delivery coordination.

Best Regards
ndestore.com`;

}

session.state="DECAL_DETAILS";

return `For customized decals and sticker orders kindly share:

Design Image
Required Dimensions (Preferably in inches)

After sharing the above kindly provide:

Consignee Name
Delivery Address
Contact Number
Email Address`;

}

/* =====================================================
PRODUCT RESPONSE
===================================================== */

function buildProductReply(data){

return `Thank you for contacting ndestore.com.

Vehicle Identified
Make: ${data.make}
Model: ${data.model}
Model Year: ${data.year}
Part Requested: ${data.part}

Website Link
${data.url}

If further assistance is required kindly share additional details.

Best Regards
ndestore.com Customer Support`;

}

/* =====================================================
MAIN AI ENGINE
===================================================== */

async function automotiveAI(message,user){

try{

const session=getSession(user);

session.language=detectLanguage(message);
session.customerType=detectCustomer(user);

const text=message.toLowerCase();

/* CUSTOM DECALS */

if(
text.includes("decal") ||
text.includes("sticker") ||
text.includes("custom")
){

return handleDecal(session);

}

/* INTERNATIONAL ADDRESS */

if(session.customerType==="INTERNATIONAL"){

if(session.state!=="ADDRESS_CONFIRMED"){

session.state="ADDRESS_REQUESTED";

return `Thank you for contacting ndestore.com.

Kindly share your delivery address including:

Country
City
Postal Code

This will allow us to confirm international delivery availability and shipping charges.`;

}

}

/* ORDER TRACKING */

const order=detectOrderNumber(message);

if(order){

const data=await fetchOrder(order);

if(!data){

return `Thank you for contacting ndestore.com.

Order #${order} was not located.

Kindly verify the order number and resend.`;

}

let reply=`Thank you for contacting ndestore.com.

Order Details

Order Number: ${data.order}
Payment Status: ${data.payment}
Fulfillment Status: ${data.status}
Courier: ${data.courier}
Tracking Number: ${data.tracking}`;

if(data.url){

reply+=`\nTrack Shipment:\n${data.url}`;

}

return reply;

}

/* PRODUCT SEARCH */

const data=analyzeAutomotiveQuery(message);

return buildProductReply(data);

}catch(err){

console.log("AI Error:",err.message);

return `Thank you for contacting ndestore.com.

We are currently experiencing a temporary technical issue.

Kindly try again shortly.

Best Regards
ndestore.com`;

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

console.log("ndestore.com Automotive AI Server Running on Port",PORT);

});
