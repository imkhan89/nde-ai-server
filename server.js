require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;


/* --------------------------------
TYPO + SYNONYM ENGINE
-------------------------------- */

const SYNONYMS = {
corola:"corolla",
civc:"civic",
break:"brake",
breaks:"brake",
bumpr:"bumper",
plugs:"spark plug",
plug:"spark plug",
filtr:"filter",
fiter:"filter"
};

function normalize(text){

let t = (text || "").toLowerCase();

for(const k in SYNONYMS){
t = t.replace(new RegExp(`\\b${k}\\b`,"g"),SYNONYMS[k]);
}

return t
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim();

}


/* --------------------------------
MODEL → MAKE DATABASE
-------------------------------- */

const MODEL_TO_MAKE = {

corolla:"toyota",
yaris:"toyota",
revo:"toyota",
hilux:"toyota",

civic:"honda",
city:"honda",

alto:"suzuki",
mehran:"suzuki",
cultus:"suzuki",
swift:"suzuki",
"wagon r":"suzuki",

sportage:"kia",

tucson:"hyundai"

};


/* --------------------------------
PART DATABASE
-------------------------------- */

const PARTS = [

"air filter",
"oil filter",
"cabin filter",
"spark plug",

"brake pad",
"brake disc",
"brake rotor",
"brake shoe",

"front bumper",
"rear bumper",
"bumper",

"headlight",
"tail light",
"fog light",

"radiator",
"radiator cap",
"radiator coolant",

"horn",

"wiper blade",
"wiper",

"engine shield",
"fender shield",

"floor mat",
"trunk mat",

"sun shade",
"car top cover"

];


/* --------------------------------
APPLICATION DETECTION
-------------------------------- */

const APPLICATIONS = [

"front",
"rear",
"left",
"right",
"upper",
"lower"

];


/* --------------------------------
ORDER STATUS KEYWORDS
-------------------------------- */

const ORDER_KEYWORDS = [

"order status",
"where is my order",
"track order",
"delivery status",
"order update"

];


/* --------------------------------
COMPLAINT KEYWORDS
-------------------------------- */

const COMPLAINT_KEYWORDS = [

"complaint",
"wrong item",
"damaged",
"return",
"refund",
"issue with order"

];


/* --------------------------------
CAPITALIZE HELPER
-------------------------------- */

function capitalize(str){

if(!str) return "";

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ");

}


/* --------------------------------
VEHICLE DETECTION
-------------------------------- */

function detectVehicle(message){

const text = normalize(message);

const yearMatch = text.match(/\b(19|20)\d{2}\b/);
const year = yearMatch ? yearMatch[0] : "";

let make="";
let model="";
let part="";
let application="";


const makes=["toyota","honda","suzuki","kia","hyundai","mg"];

const models=[
"corolla",
"civic",
"city",
"yaris",
"revo",
"hilux",
"sportage",
"tucson",
"alto",
"mehran",
"cultus",
"swift",
"wagon r"
];


/* Detect Make */

for(const m of makes){
if(text.includes(m)){
make=m;
break;
}
}


/* Detect Model */

for(const m of models){
if(text.includes(m)){
model=m;
break;
}
}


/* Detect Part */

for(const p of PARTS){
if(text.includes(p)){
part=p;
break;
}
}


/* Detect Application */

for(const a of APPLICATIONS){
if(text.includes(a)){
application=a;
break;
}
}


/* Infer make from model */

if(!make && model && MODEL_TO_MAKE[model]){
make = MODEL_TO_MAKE[model];
}


return{
make,
model,
year,
part,
application
};

}


/* --------------------------------
INTENT DETECTION
-------------------------------- */

function detectIntent(message){

const text = normalize(message);

for(const k of ORDER_KEYWORDS){
if(text.includes(k)) return "order";
}

for(const k of COMPLAINT_KEYWORDS){
if(text.includes(k)) return "complaint";
}

return "product";

}


/* --------------------------------
SEARCH URL
-------------------------------- */

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

}


/* --------------------------------
SEARCH QUERY BUILDER
-------------------------------- */

function buildQuery(vehicle,message){

const query=[];

if(vehicle.make) query.push(vehicle.make);
if(vehicle.model) query.push(vehicle.model);
if(vehicle.part) query.push(vehicle.part);

const q=query.join(" ");

if(q.length>3) return q;

return normalize(message);

}


/* --------------------------------
REPLY BUILDER
-------------------------------- */

function buildReply(vehicle,query){

const url=buildSearchURL(query);

const make=capitalize(vehicle.make);
const model=capitalize(vehicle.model);
const part=capitalize(vehicle.part);
const application=capitalize(vehicle.application);

let partText = part || "Automotive Part";

if(application && part){
partText = `${part}, ${application}`;
}

return `Thank you for contacting ndestore.com kindly note the following:

Make: ${make || "Not Specified"}
Model: ${model || "Not Specified"}
Model Year: ${vehicle.year || "Not Specified"}
Part Requested: ${partText}

Website Link:
${url}

If you would like further assistance share detailed inquiry.`;

}


/* --------------------------------
ORDER STATUS RESPONSE
-------------------------------- */

function orderReply(){

return `Thank you for contacting ndestore.com.

To check your delivery status kindly share your order number.

Our team will review the order and provide an update shortly.`;

}


/* --------------------------------
COMPLAINT RESPONSE
-------------------------------- */

function complaintReply(){

return `Thank you for contacting ndestore.com.

We are sorry to hear about the issue.

Kindly share:

Order Number
Complaint Description

Our support team will review the matter and assist you accordingly.`;

}


/* --------------------------------
XML SAFE
-------------------------------- */

function xmlSafe(text){

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}


/* --------------------------------
WHATSAPP WEBHOOK
-------------------------------- */

app.post("/whatsapp",(req,res)=>{

const message=(req.body.Body || "").trim();

const intent=detectIntent(message);

let reply="";


if(intent==="order"){

reply=orderReply();

}
else if(intent==="complaint"){

reply=complaintReply();

}
else{

const vehicle=detectVehicle(message);

const query=buildQuery(vehicle,message);

reply=buildReply(vehicle,query);

}


const twiml=`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;


res.set("Content-Type","text/xml");
res.send(twiml);

});


/* --------------------------------
SERVER START
-------------------------------- */

app.listen(PORT,()=>{

console.log("NDE AI Server running on port:",PORT);

});
