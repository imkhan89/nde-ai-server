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

function getSession(user) {
  if (!SESSIONS[user]) {
    SESSIONS[user] = {
      state: "MENU"
    };
  }
  return SESSIONS[user];
}

/* =====================================================
HELPERS
===================================================== */

function uid() {
  return crypto.randomBytes(6).toString("hex");
}

function xmlSafe(str) {
  return str
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
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
DECAL COLLECTION LINKS
===================================================== */

const DECAL_LINKS = {
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
order:o.name,
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
MAIN AI LOGIC
===================================================== */

async function automotiveAI(message,user){

const session=getSession(user);

const text=message.toLowerCase().trim();

/* GREETING */

if(session.state==="MENU"){

if(text.match(/hi|hello|salam|aoa|hey/)){
return mainMenu();
}

/* OPTION 1 */

if(text==="1"){
session.state="PART_REQUEST";
return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required`;
}

/* OPTION 2 */

if(text==="2"){
session.state="PART_REQUEST";
return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Accessory Required`;
}

/* OPTION 3 */

if(text==="3"){
session.state="ORDER";
return `Please share your Order Number`;
}

/* OPTION 4 */

if(text==="4"){
session.state="COMPLAINT";
return `Please share

Order Number
Complaint Details`;
}

/* OPTION 5 */

if(text==="5"){
session.state="DECALS";
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

/* OPTION 6 */

if(text==="6"){
return `Contact us at

Whatsapp +92-321-4222294
Landline +92-423-7724222
Email info@ndestore.com`;
}

}

/* =====================================================
PART SEARCH FLOW
===================================================== */

if(session.state==="PART_REQUEST"){

session.state="END";

return `Vehicle Make:
Vehicle Model:
Model Year:
Part Required

Website URL

If you want to connect with a live agent let us know

Yes (Connect with the live agent)
No (Finish chat)`;

}

/* =====================================================
ORDER FLOW
===================================================== */

if(session.state==="ORDER"){

const orderMatch=message.match(/\d{5,}/);

if(!orderMatch){
return `Please provide a valid order number`;
}

const orderData=await fetchOrder(orderMatch[0]);

if(!orderData){
return `Order not located. Kindly verify order number`;
}

return `Order ID ${orderData.order}

Status ${orderData.status}

Tracking Details ${orderData.tracking}

Courier ${orderData.courier}`;

}

/* =====================================================
COMPLAINT FLOW
===================================================== */

if(session.state==="COMPLAINT"){

const ticket="TKT-"+Math.floor(Math.random()*90000+10000);

session.state="END";

return `Complaint Registered

Ticket Number ${ticket}

Our representative will contact you shortly with a resolution.

We regret the inconvenience caused.`;

}

/* =====================================================
DECAL FLOW
===================================================== */

if(session.state==="DECALS"){

if(DECAL_LINKS[text]){

return `Kindly visit the following website link

${DECAL_LINKS[text]}`;

}

return `Please select a number between 1 and 15`;

}

/* =====================================================
DEFAULT FALLBACK
===================================================== */

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

res.send(`<Response><Message>System temporarily unavailable</Message></Response>`);

}

});

/* =====================================================
SERVER
===================================================== */

app.get("/",(req,res)=>{
res.send("ndestore AI Running");
});

app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});
