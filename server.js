require("dotenv").config();

const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =====================================================
SESSION MEMORY
===================================================== */

let SESSIONS = {};

function getSession(user){
if(!SESSIONS[user]){
SESSIONS[user]={state:"NEW"};
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

function titleCase(str){
return str.replace(/\w\S*/g,(txt)=>txt.charAt(0).toUpperCase()+txt.substr(1));
}

/* =====================================================
TEXT NORMALIZATION
===================================================== */

function normalizeText(text){

text = text.toLowerCase();

const replacements = {

"ac filter":"cabin filter",
"a/c filter":"cabin filter",
"airfilter":"air filter",
"oilfilter":"oil filter",
"break pad":"brake pad",
"brakepads":"brake pad",
"sparkplug":"spark plug",
"wipers":"wiper"

};

for(const r in replacements){
text = text.replace(r,replacements[r]);
}

return text;
}

/* =====================================================
MAIN MENU
===================================================== */

function mainMenu(){

return `Thank you for contacting ndestore.com.

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
VEHICLE DATABASE
===================================================== */

const VEHICLES = {

civic:{make:"Honda",gens:[
{range:"2017-2021",start:2017,end:2021},
{range:"2013-2016",start:2013,end:2016}
]},

corolla:{make:"Toyota",gens:[
{range:"2014-2020",start:2014,end:2020},
{range:"2009-2013",start:2009,end:2013}
]},

cultus:{make:"Suzuki",gens:[
{range:"2017-Present",start:2017,end:2030}
]},

city:{make:"Honda",gens:[
{range:"2014-2021",start:2014,end:2021}
]}

};

/* =====================================================
PART DATABASE
===================================================== */

const PART_MAP={

"brake pad":"Brake Pads",
"air filter":"Air Filter",
"oil filter":"Oil Filter",
"cabin filter":"Cabin Filter",
"spark plug":"Spark Plug",
"wiper":"Wiper Blade",

"floor mat":"Floor Mats",
"sun shade":"Sun Shade",
"air visor":"Air Visor",
"mud flap":"Mud Flaps",
"trunk tray":"Trunk Tray",

"sticker":"Sticker",
"decal":"Decal"

};

/* =====================================================
VEHICLE DETECTION
===================================================== */

function detectVehicle(text){

let model="";
let make="";
let generation="";
let year=null;

const yearMatch = text.match(/20\d{2}/);

if(yearMatch){
year=parseInt(yearMatch[0]);
}

for(const v in VEHICLES){

if(text.includes(v)){

model=titleCase(v);
make=VEHICLES[v].make;

for(const g of VEHICLES[v].gens){

if(year && year>=g.start && year<=g.end){
generation=g.range;
}

}

}

}

return {make,model,generation};
}

/* =====================================================
PART DETECTION
===================================================== */

function detectPart(text){

for(const p in PART_MAP){

if(text.includes(p)){
return PART_MAP[p];
}

}

return "";
}

/* =====================================================
SHOPIFY SEARCH
===================================================== */

function buildSearchURL(make,model,generation,part){

const query=`${part} ${make} ${model} ${generation || ""}`
.replace(/\s+/g,"+")
.toLowerCase();

return `https://ndestore.com/search?q=${query}`;
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
AI ENGINE
===================================================== */

async function automotiveAI(message,user){

const session=getSession(user);

let text=(message || "").toLowerCase().trim();
text = normalizeText(text);

/* FIRST MESSAGE ALWAYS TRIGGERS GREETING */

if(session.state==="NEW"){

session.state="MENU";

return mainMenu();

}

/* MENU */

if(session.state==="MENU"){

/* PARTS */

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

/* ACCESSORIES */

if(text==="2"){

session.state="ACCESSORY_SEARCH";

return `Please confirm

Vehicle Make
Vehicle Model
Accessory Required

Example
Toyota Aqua Floor Mat`;

}
}

if(text==="3"){

session.state="ORDER";

return `Please share your order number

Example
10011421`;

}

if(text==="4"){

session.state="COMPLAINT";

return `Please describe the complaint and include your order number`;

}

if(text==="5"){

session.state="DECAL";

return `Visit decal collection

https://www.ndestore.com/collections/stickers-decal`;

}

if(text==="6"){

return `Customer Support

Whatsapp +92-321-4222294
Landline +92-423-7724222
Email info@ndestore.com`;

}

return mainMenu();

}

/* PART SEARCH */

if(session.state==="PART_SEARCH"){

const vehicle=detectVehicle(text);
const part=detectPart(text);

if(!vehicle.make || !vehicle.model || !part){

return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Honda Civic 2018 Brake Pad`;

}

const url=buildSearchURL(vehicle.make,vehicle.model,vehicle.generation,part);

session.state="MENU";

return `Thank you for contacting ndestore.com.

Vehicle Details

Vehicle Make: ${vehicle.make}
Model Name: ${vehicle.model}
Model Year: ${vehicle.generation || "Unknown"}
Part Required: ${part}

Product URL
${url}

Best Regards
Customer Support Team
ndestore.com`;

}

/* ACCESSORY SEARCH */

if(session.state==="ACCESSORY_SEARCH"){

const vehicle=detectVehicle(text);
const part=detectPart(text);

if(!vehicle.make || !vehicle.model || !part){

return `Please confirm

Vehicle Make
Vehicle Model
Accessory Required

Example
Toyota Aqua Floor Mat`;

}

const url=buildSearchURL(vehicle.make,vehicle.model,"",part);

session.state="MENU";

return `Thank you for contacting ndestore.com.

Vehicle Details

Vehicle Make: ${vehicle.make}
Model Name: ${vehicle.model}
Accessory Required: ${part}

Product URL
${url}

Best Regards
Customer Support Team
ndestore.com`;

}

/* ORDER STATUS */

if(session.state==="ORDER"){

const orderMatch=text.match(/\d{5,}/);

if(!orderMatch){
return `Please provide a valid order number`;
}

const order=await fetchOrder(orderMatch[0]);

if(!order){
return `Order not located`;
}

session.state="MENU";

return `Order ID: ${order.id}

Status: ${order.status}

Tracking Number: ${order.tracking}

Courier Company: ${order.courier}`;

}

/* COMPLAINT */

if(session.state==="COMPLAINT"){

const ticket="TKT-"+Math.floor(Math.random()*90000+10000);

session.state="MENU";

return `Complaint Registered

Ticket Number: ${ticket}

Our representative will contact you shortly.`;

}

return mainMenu();

}

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

try{

const message = req.body.Body || "";
const user = req.body.From || uid();

console.log("Incoming:",message);

let reply = await automotiveAI(message,user);

if(!reply || reply.trim()===""){
reply="Please confirm Vehicle Make Model Year and Part Required.";
}

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

}catch(e){

console.log("Webhook error:",e);

res.send(`<Response><Message>System temporarily unavailable</Message></Response>`);

}

});

/* =====================================================
SERVER
===================================================== */

app.listen(PORT,()=>{
console.log("AI Server Running");
});
