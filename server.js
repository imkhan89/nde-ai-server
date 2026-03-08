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

function xmlSafe(str){

return str
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

function normalizeText(text){

return text
.toLowerCase()
.replace(/\+/g," ")
.replace(/-/g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

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
SHOPIFY SEARCH URL BUILDER
Best practice: part + make + model
===================================================== */

function buildSearchURL(part, make, model){

let q = [];

if(part && part !== "Not Specified") q.push(part);
if(make && make !== "Not Specified") q.push(make);
if(model && model !== "Not Specified") q.push(model);

const query = q
.join(" ")
.trim()
.replace(/\s+/g,"+")
.toLowerCase();

return `https://www.ndestore.com/search?q=${query}`;

}

async function automotiveAI(message,user){

const session=getSession(user);

let text = normalizeText(message);

/* =========================================
HANDLE MENU NUMBERS FIRST
========================================= */

if(/^[1-6]$/.test(text)){

session.state="MENU";

}

/* =========================================
RUN AI DETECTION
========================================= */

const aiResult = analyzeAutomotiveQuery(text);

/* =========================================
MODEL YEAR OPTIONS
========================================= */

if(aiResult.yearOptions){

return `Kindly provide vehicle model year

${aiResult.yearOptions.join("\n")}`;

}

/* =========================================
VALID AUTOMOTIVE QUERY
========================================= */

if(
aiResult.part !== "Not Specified" &&
aiResult.model !== "Not Specified"
){

const url = buildSearchURL(
aiResult.part,
aiResult.make,
aiResult.model
);

session.state="MENU";

return `Vehicle Details

Vehicle Make: ${aiResult.make}
Model Name: ${aiResult.model}
Model Year: ${aiResult.year}
Part Required: ${aiResult.part}

Product Search
${url}

Best Regards
Customer Support
ndestore.com`;

}

/* =========================================
SMART FALLBACK SEARCH
If AI partially fails
========================================= */

if(text.split(" ").length >= 3){

const words = text.split(" ");

const part = words[words.length-1];
const make = words[0];
const model = words[1];

const fallbackURL = buildSearchURL(part, make, model);

return `Product Search

${fallbackURL}

Best Regards
Customer Support
ndestore.com`;

}

/* =========================================
FIRST MESSAGE MENU
========================================= */

if(session.state==="NEW"){

session.state="MENU";

return mainMenu();

}

/* =========================================
MENU
========================================= */

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

/* =========================================
PART SEARCH STATE
========================================= */

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

const url = buildSearchURL(
result.part,
result.make,
result.model
);

session.state="MENU";

return `Vehicle Details

Vehicle Make: ${result.make}
Model Name: ${result.model}
Model Year: ${result.year}
Part Required: ${result.part}

Product Search
${url}

Best Regards
Customer Support
ndestore.com`;

}

/* =========================================
DEFAULT
========================================= */

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
