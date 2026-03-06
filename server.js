const { execSync } = require("child_process");

async function buildIndexes(){

try{

console.log("Building product index...");
execSync("node buildProductIndex.js", { stdio: "inherit" });

console.log("Building search index...");
execSync("node buildSearchIndex.js", { stdio: "inherit" });

console.log("Indexes ready");

}catch(err){

console.error("Index build failed:", err.message);

}

}

buildIndexes();

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
SESSIONS[user]={state:"MENU"};
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
GREETING DETECTION
===================================================== */

function isGreeting(text){

const greetings=[
"hi",
"hello",
"salam",
"aoa",
"assalamualaikum",
"good morning",
"good evening"
];

return greetings.some(g=>text.startsWith(g));

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
VEHICLE KNOWLEDGE BASE
===================================================== */

const VEHICLES = {

civic:{make:"Honda",gens:[
{range:"2017–2021",start:2017,end:2021},
{range:"2013–2016",start:2013,end:2016}
]},

corolla:{make:"Toyota",gens:[
{range:"2014–2020",start:2014,end:2020},
{range:"2009–2013",start:2009,end:2013}
]},

cultus:{make:"Suzuki",gens:[
{range:"2017–Present",start:2017,end:2030}
]},

city:{make:"Honda",gens:[
{range:"2014–2021",start:2014,end:2021}
]}

};

/* =====================================================
PART NORMALIZATION
===================================================== */

const PART_MAP={

/* SERVICE PARTS */

"brake pad":"Brake Pads",
"brake pads":"Brake Pads",
"air filter":"Air Filter",
"oil filter":"Oil Filter",
"cabin filter":"Cabin Filter",
"spark plug":"Spark Plug",
"radiator":"Radiator",
"horn":"Horn",
"wiper":"Wiper Blade",

/* ACCESSORIES */

"floor mat":"Floor Mats",
"floor mats":"Floor Mats",
"car mat":"Floor Mats",
"sun shade":"Sun Shade",
"sunshade":"Sun Shade",
"air visor":"Air Visor",
"door visor":"Air Visor",
"mud flap":"Mud Flaps",
"mud flaps":"Mud Flaps",
"trunk tray":"Trunk Tray",
"car cover":"Car Cover",
"seat cover":"Seat Cover",
"steering cover":"Steering Cover",

/* DECALS */

"sticker":"Sticker",
"decal":"Decal",
"sticker decal":"Sticker Decal"

};

/* =====================================================
VEHICLE DETECTION
===================================================== */

/* =====================================================
VEHICLE DETECTION
===================================================== */

function detectVehicle(text){

text = text.toLowerCase();

let model = "";
let make = "";
let generation = "";
let year = null;

/* detect year */

const yearMatch = text.match(/20\d{2}/);

if(yearMatch){
year = parseInt(yearMatch[0]);
}

/* detect vehicle */

for(const v in VEHICLES){

if(text.includes(v)){

model = titleCase(v);
make = VEHICLES[v].make;

/* detect generation */

if(year && VEHICLES[v].gens){

for(const g of VEHICLES[v].gens){

if(year >= g.start && year <= g.end){
generation = g.range;
}

}

}

}

}

return {
make,
model,
generation
};

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
SHOPIFY SEARCH URL
===================================================== */

function buildSearchURL(make,model,generation,part){

const query=`${make} ${model} ${generation || ""} ${part}`
.replace(/\s+/g,"+")
.toLowerCase();

return `https://ndestore.com/search?q=${query}`;

}

/* =====================================================
ORDER LOOKUP
===================================================== */

async function fetchOrder(order){

try{

const url=`https://${process.env.SHOPIFY_STORE}/admin/api/2023-10/orders.json`;

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
tracking:o.fulfillments?.[0]?.tracking_number || "In Process",
courier:o.fulfillments?.[0]?.tracking_company || "In Process"
};

}catch(e){

console.log(e.message);
return null;

}

}

/* =====================================================
DECAL COLLECTION LINKS
===================================================== */

const DECALS={

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
const text=(message || "").toLowerCase().trim();

/* Greeting */

if(isGreeting(text)){
session.state="MENU";
return mainMenu();
}

/* MENU */

if(session.state==="MENU"){

if(text==="1" || text==="2"){

session.state="PART_SEARCH";

return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Honda Civic 2018 Brake Pad`;

}

if(text==="3"){

session.state="ORDER";

return `Please share your order number

Example
10011421`;

}

if(text==="4"){

session.state="COMPLAINT";

return `Please share

Order Number
Complaint Details`;

}

if(text==="5"){

session.state="DECAL";

return `Select one of the following options

1 Complete Collection
2 Army Stickers
3 Advocate Stickers
4 Doctor Stickers
5 Markhor Stickers
6 Hunter Stickers
7 Toyota Stickers
8 Toyota TEQ Stickers
9 Honda Stickers
10 Sports Mind Stickers
11 Door Sill
12 Laptop Stickers
13 GR Stickers
14 Fire Arm Stickers
15 Custom Decals`;

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

Your vehicle details have been identified as follows:

Vehicle Details

Vehicle Make: ${vehicle.make}
Model Name: ${vehicle.model}
Model Year: ${vehicle.generation || "Unknown"}
Part Required: ${part}

Product URL:
${url}

If you require assistance with compatibility confirmation or installation guidance, please feel free to let us know.

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

Tracking Details: ${order.tracking}

Courier Company: ${order.courier}`;

}

/* COMPLAINT */

if(session.state==="COMPLAINT"){

const ticket="TKT-"+Math.floor(Math.random()*90000+10000);

session.state="MENU";

return `Complaint Registered

Ticket Number ${ticket}

Our representative shall contact you shortly with a resolution.

We regret the inconvenience caused.`;

}

/* DECALS */

if(session.state==="DECAL"){

if(DECALS[text]){
return `Kindly visit the following website link

${DECALS[text]}`;
}

return `Please select a number between 1 and 15`;

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

app.listen(PORT,()=>{
console.log("AI Server Running");
});
