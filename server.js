const { analyzeAutomotiveQuery } = require("./automotive_ai_engine");
const vehicleGraph = require("./data/vehicle_database")

require("dotenv").config();

const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =====================================================
SESSION MEMORY
===================================================== */

const SESSIONS = {};

function getSession(user){

if(!SESSIONS[user]){

SESSIONS[user]={
state:"NEW",
retries:0,
data:{}
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
MAIN MENU
===================================================== */

function mainMenu(){

return `Welcome to ndestore.com
How can we help you?

1 Parts Inquiry
2 Car Accessories
3 Order Status
4 Complaints
5 Decal Stickers
6 Other

Please reply with 1 2 3 4 5 or 6`;

}

/* =====================================================
SHOPIFY SEARCH URL
===================================================== */

function buildSearchURL(part,make,model,year){

let query=`${part} for ${make} ${model} ${year}`
.trim()
.replace(/\s+/g,"+")
.toLowerCase();

return `https://www.ndestore.com/search?q=${query}`;

}

/* =====================================================
ORDER LOOKUP
===================================================== */

async function fetchOrder(order){

try{

const url=`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/orders.json`;

const res=await axios.get(url,{
headers:{
"X-Shopify-Access-Token":process.env.SHOPIFY_ADMIN_API_TOKEN
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
tracking:o.fulfillments?.[0]?.tracking_number || "Processing",
courier:o.fulfillments?.[0]?.tracking_company || "Processing"
};

}catch(e){

console.log(e.message);
return null;

}

}

/* =====================================================
COMPLAINT TICKET
===================================================== */

function generateTicket(){

const n=Math.floor(Math.random()*900000+100000);

return `TKT-${n}`;

}

/* =====================================================
AI ENGINE
===================================================== */

async function automotiveAI(message,user){

const session=getSession(user);

let text=(message || "").toLowerCase().trim();

/* =====================================================
SMART AUTOMOTIVE DETECTION
Skip menu if valid automotive query
===================================================== */

const aiResult = analyzeAutomotiveQuery(text);

/* prevent interception of menu selections */

if(
!/^[1-6]$/.test(text) &&
aiResult.part !== "Not Specified" &&
aiResult.model !== "Not Specified"
){

const url = buildSearchURL(
aiResult.part,
aiResult.make,
aiResult.model,
aiResult.year
);

session.state="MENU";

return `Vehicle Details

Vehicle Make: ${aiResult.make}
Model Name: ${aiResult.model}
Model Year: ${aiResult.year}
Part Required: ${aiResult.part}

Product URL
${url}

Best Regards
Customer Support
ndestore.com`;

}

/* =====================================================
FIRST MESSAGE
===================================================== */

if(session.state==="NEW"){

session.state="MENU";

return mainMenu();

}

/* =====================================================
MENU
===================================================== */

if(session.state==="MENU"){

text=text.replace(/[^0-9]/g,"");

if(text==="1"){

session.state="PART_SEARCH";

return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Honda Civic 2018 Brake Pad`;

}

if(text==="2"){

session.state="ACCESSORY_SEARCH";

return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Required Accessory

Example
Toyota Aqua 2018 Floor Mat`;

}

if(text==="3"){

session.state="ORDER";

return `Please share your order number

Example
10011421`;

}

if(text==="4"){

session.state="COMPLAINT";

return `Kindly share the following information

Order Number
Complaint Details`;

}

if(text==="5"){

session.state="DECAL_MENU";

return `Decal Sticker Options

1 Complete Collection
2 Collection Options
3 Customized Decals

Reply with 1 2 or 3`;

}

if(text==="6"){

session.state="CHAT";

return `Please share your inquiry and our assistant will assist you shortly.`;

}

return mainMenu();

}

/* =====================================================
PART SEARCH
===================================================== */

if(session.state==="PART_SEARCH"){

const result = analyzeAutomotiveQuery(text);

if(result.part==="Not Specified" || result.model==="Not Specified"){

session.retries++;

if(session.retries>=2){

session.state="MENU";
session.retries=0;

return `We were unable to identify the product.

Please contact our representative

WhatsApp
+92 308 7643288
+92 321 4222294

or visit
www.ndestore.com`;

}

return `Please share details in the following format

Part Name + Vehicle Make + Vehicle Model + Model Year

Example
Brake Pad Toyota Corolla 2018`;

}

session.retries=0;

const url=buildSearchURL(
result.part,
result.make,
result.model,
result.year
);

session.state="MENU";

return `Vehicle Details

Vehicle Make: ${result.make}
Model Name: ${result.model}
Model Year: ${result.year}
Part Required: ${result.part}

Product URL
${url}

Best Regards
Customer Support
ndestore.com`;

}

/* =====================================================
ACCESSORY SEARCH
===================================================== */

if(session.state==="ACCESSORY_SEARCH"){

const result = analyzeAutomotiveQuery(text);

if(result.part==="Not Specified" || result.model==="Not Specified"){

session.retries++;

if(session.retries>=2){

session.state="MENU";
session.retries=0;

return `We were unable to identify the accessory.

Please contact our representative

WhatsApp
+92 308 7643288
+92 321 4222294`;

}

return `Please share details in the following format

Accessory + Vehicle Make + Vehicle Model + Model Year

Example
Floor Mat Toyota Corolla 2018`;

}

session.retries=0;

const url=buildSearchURL(
result.part,
result.make,
result.model,
result.year
);

session.state="MENU";

return `Vehicle Details

Vehicle Make: ${result.make}
Model Name: ${result.model}
Model Year: ${result.year}
Required Accessory: ${result.part}

Product URL
${url}

Best Regards
Customer Support
ndestore.com`;

}

/* =====================================================
ORDER STATUS
===================================================== */

if(session.state==="ORDER"){

const orderMatch=text.match(/\d{5,}/);

if(!orderMatch){

return `Please provide a valid order number`;

}

const order = await fetchOrder(orderMatch[0]);

if(!order){

return `Order not located`;

}

session.state="MENU";

return `Order ID: ${order.id}

Status: ${order.status}

Tracking Number: ${order.tracking}

Courier Company: ${order.courier}`;

}

/* =====================================================
COMPLAINT
===================================================== */

if(session.state==="COMPLAINT"){

const ticket=generateTicket();

session.state="MENU";

return `Complaint Submitted

Ticket Number: ${ticket}

Our representative will contact you shortly.

Thank you for contacting ndestore.com`;

}

/* =====================================================
DECAL MENU
===================================================== */

if(session.state==="DECAL_MENU"){

if(text==="1"){

session.state="MENU";

return `For the full decal sticker range kindly explore the following link

https://www.ndestore.com/collections/stickers-decal`;

}

if(text==="2"){

session.state="MENU";

return `Browse our decal sticker collections

https://www.ndestore.com/collections`;

}

if(text==="3"){

session.state="MENU";

return `For customized decal stickers please visit

https://www.ndestore.com/pages/custom-decal-and-sticker`;

}

return `Reply with 1 2 or 3`;

}

/* =====================================================
CHAT MODE
===================================================== */

if(session.state==="CHAT"){

session.state="MENU";

return `Thank you for contacting ndestore.com.

Our support team will review your inquiry and respond shortly.

For urgent assistance please contact

WhatsApp
+92 321 4222294`;

}

return mainMenu();

}

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

try{

const message = req.body.Body || "";
const user = req.body.From || "";

console.log("Incoming:", message);

const vehicleResult = vehicleGraph.identifyVehicle(message);

if(vehicleResult && vehicleResult.vehicle){

const reply = `
Vehicle Identified

Make: ${vehicleResult.vehicle.make}
Model: ${vehicleResult.vehicle.model}
Year Range: ${vehicleResult.vehicle.year_start}-${vehicleResult.vehicle.year_end}
`;

res.set("Content-Type","text/xml");

return res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

}

let reply = await automotiveAI(message,user);

if(!reply || reply.trim()===""){
reply = "Please confirm Vehicle Make Model Year and Part Required.";
}

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

}catch(e){

console.log("Webhook error:",e);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>System temporarily unavailable</Message></Response>`);

}

});

/* =====================================================
SERVER
===================================================== */

app.listen(PORT,()=>{
console.log("AI Server Running");
});
