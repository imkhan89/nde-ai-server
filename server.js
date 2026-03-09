require("dotenv").config();

const express = require("express");
const axios = require("axios");

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine");
const { detectAllPositions } = require("./data/part_positions");
const session = require("./sessions/sessionManager");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =====================================================
HELPERS
===================================================== */

function xmlSafe(str){

return String(str)
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");

}

function normalizeText(text){

return String(text)
.toLowerCase()
.replace(/+/g," ")
.replace(/-/g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}

function normalizePhone(phone){

return String(phone)
.replace("whatsapp:","")
.replace(/\D/g,"")
.replace(/^0/,"92");

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
SEARCH URL BUILDER
===================================================== */

function buildSearchURL(part, make, model){

let q = [];

if(part && part !== "Not Specified") q.push(part);
if(make && make !== "Not Specified") q.push(make);
if(model && model !== "Not Specified") q.push(model);

const query = q.join(" ")
.trim()
.replace(/\s+/g,"+")
.toLowerCase();

return `https://www.ndestore.com/search?q=${query}`;

}

/* =====================================================
CONVERSATION ENGINE
===================================================== */

async function automotiveAI(message,user){

const sessionData=session.getSession(user);
let text = normalizeText(message);

/* POSITION DETECTION */

const positions = detectAllPositions(text);

/* MENU NUMBER DETECTION */

if(/^[1-6]$/.test(text)){
sessionData.state="MENU";
}

/* RUN AI */

const aiResult = analyzeAutomotiveQuery(text);

const structuredResult = {
vehicleMake: aiResult.make,
vehicleModel: aiResult.model,
vehicleYear: aiResult.year,
part: aiResult.part,
positions: positions
};

console.log("AI Result:", structuredResult);

/* YEAR OPTIONS */

if(aiResult.yearOptions){

return `Kindly provide vehicle model year

${aiResult.yearOptions.join("\n")}`;

}

/* VALID QUERY */

if(
aiResult.part !== "Not Specified" &&
aiResult.model !== "Not Specified"
){

const url = buildSearchURL(
aiResult.part,
aiResult.make,
aiResult.model
);

sessionData.state="MENU";

return `Vehicle Details

Vehicle Make: ${aiResult.make}
Model Name: ${aiResult.model}
Model Year: ${aiResult.year}
Part Required: ${aiResult.part}
Position: ${positions.join(", ") || "Not Specified"}

Product Search
${url}

Best Regards
Customer Support
ndestore.com`;

}

/* FALLBACK SEARCH */

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

/* FIRST MESSAGE */

if(sessionData.state==="NEW"){

sessionData.state="MENU";

if(!/^[1-6]$/.test(text)){
return mainMenu();
}

}

/* MENU */

if(sessionData.state==="MENU"){

text=text.replace(/[^0-9]/g,"");

if(text==="1"){
sessionData.state="PART_SEARCH";
return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Part Required

Example
Honda Civic 2018 Brake Pad`;
}

if(text==="2"){
sessionData.state="ACCESSORY_SEARCH";
return `Please confirm

Vehicle Make
Vehicle Model
Model Year
Required Accessory

Example
Toyota Aqua 2018 Floor Mat`;
}

if(text==="3"){
sessionData.state="ORDER";
return `Please share your order number

Example
10011421`;
}

if(text==="4"){
sessionData.state="COMPLAINT";
return `Kindly share the following information

Order Number
Complaint Details`;
}

if(text==="5"){
sessionData.state="DECAL_MENU";
return `Decal Sticker Options

1 Complete Collection
2 Collection Options
3 Customized Decals

Reply with 1 2 or 3`;
}

if(text==="6"){
sessionData.state="CHAT";
return `Please share your inquiry and our assistant will assist you shortly.`;
}

return mainMenu();

}

/* PART SEARCH */

if(sessionData.state==="PART_SEARCH"){

const result = analyzeAutomotiveQuery(text);

if(result.part==="Not Specified" || result.model==="Not Specified"){

sessionData.retries++;

if(sessionData.retries>=2){

sessionData.state="MENU";
sessionData.retries=0;

return `We were unable to identify the product.

Please contact our representative

WhatsApp
+92 308 7643288
+92 321 4222294

or visit
[www.ndestore.com`](http://www.ndestore.com`);

}

return `Please share details in the following format

Part Name + Vehicle Make + Vehicle Model + Model Year

Example
Brake Pad Toyota Corolla 2018`;

}

sessionData.retries=0;

const url = buildSearchURL(
result.part,
result.make,
result.model
);

sessionData.state="MENU";

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

return mainMenu();

}

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

try{

const rawUser = req.body.From || "";
const message = req.body.Body || "";

const user = normalizePhone(rawUser);

console.log("Incoming:", message);

if(!session.sessionExists(user)){
session.createSession(user);
}

session.updateSession(user);
session.logSession(user,"USER: "+message);

let reply = await automotiveAI(message,user);

if(!reply || reply.trim()===""){
reply = "Please confirm Vehicle Make Model Year and Part Required.";
}

session.logSession(user,"BOT: "+reply);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);

}catch(e){

console.log("Webhook error:",e);

res.set("Content-Type","text/xml");

res.send(`<Response><Message>System temporarily unavailable</Message></Response>`);

}

});

/* =====================================================
SEND API
===================================================== */

app.post("/send-message",async(req,res)=>{

try{

const {phone,message}=req.body;

await axios.post(process.env.WHATSAPP_SEND_URL,{
phone,
message
});

res.send("sent");

}catch(e){

console.log("Send message error",e);
res.status(500).send("error");

}

});

/* =====================================================
GLOBAL ERROR HANDLER
===================================================== */

process.on("uncaughtException",(err)=>{
console.error("Uncaught Exception:",err);
});

process.on("unhandledRejection",(err)=>{
console.error("Unhandled Rejection:",err);
});

/* =====================================================
SERVER
===================================================== */

app.listen(PORT,()=>{
console.log("AI Server Running on port",PORT);
});
