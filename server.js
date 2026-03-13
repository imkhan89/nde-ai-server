require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const { syncShopifyCatalog } = require("./shopify_catalog_sync_engine");
const { parseVehicleQuery } = require("./vehicle_query_parser");
const { fastProductSearch } = require("./fast_product_search_engine");
const { fitmentSearch } = require("./vehicle_fitment_search_engine");
const { generateServiceKit } = require("./service_kit_ai_engine");
const { detectComplaint } = require("./complaint_engine");
const { alertAgent } = require("./agent_alert_engine");

const {
loadVehicleMemory,
rememberVehicle,
applyCustomerVehicle
} = require("./vehicle_memory_engine");

const {
sendMainMenu,
sendVehicleConfirmation,
sendProductCards
} = require("./whatsapp_commerce_interface");

const {
sendVehicleMakes,
sendVehicleModels,
sendVehicleYears
} = require("./vehicle_selection_interface");

const app = express();

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname,"../data");

const PRODUCT_INDEX_FILE = path.join(DATA_DIR,"product_index.json");
const VEHICLE_DB_FILE = path.join(DATA_DIR,"global_vehicle_database.json");

let productIndex = [];
let vehicleDB = [];

const PORT = process.env.PORT || 8080;



/* ----------------------------- */
/* LOAD PRODUCT INDEX            */
/* ----------------------------- */

function loadProductIndex(){

try{

if(!fs.existsSync(PRODUCT_INDEX_FILE)){

console.log("Product index missing");
return;

}

productIndex = JSON.parse(fs.readFileSync(PRODUCT_INDEX_FILE));

console.log("Fast product search index loaded:",productIndex.length);

}catch(err){

console.log("Product index load error");

}

}



/* ----------------------------- */
/* LOAD VEHICLE DATABASE         */
/* ----------------------------- */

function loadVehicleDatabase(){

try{

if(!fs.existsSync(VEHICLE_DB_FILE)){

console.log("Vehicle database missing");
return;

}

vehicleDB = JSON.parse(fs.readFileSync(VEHICLE_DB_FILE));

console.log("Global vehicle database loaded");

}catch(err){

console.log("Vehicle database load error");

}

}



/* ----------------------------- */
/* WHATSAPP WEBHOOK              */
/* ----------------------------- */

app.post("/twilio/webhook",async(req,res)=>{

const message = (req.body.Body || "").trim();
const from = req.body.From || "";

console.log("Incoming message:",message);



/* MAIN MENU */

if(message.toLowerCase()==="menu" || message==="hi"){

res.type("text/xml");
return res.send(sendMainMenu());

}



/* AUTO PARTS MENU */

if(message==="1"){

res.type("text/xml");
return res.send(sendVehicleMakes(vehicleDB));

}



/* COMPLAINT DETECTION */

if(detectComplaint(message)){

await alertAgent(from,message);

res.type("text/xml");

return res.send(`
Your complaint has been received.

Our support team will contact you shortly.

Support
+92 308 7643288
`);

}



/* APPLY VEHICLE MEMORY */

const enhancedMessage = applyCustomerVehicle(from,message);



/* PARSE VEHICLE QUERY */

const vehicleQuery = parseVehicleQuery(enhancedMessage);



if(vehicleQuery){

rememberVehicle(

from,
vehicleQuery.make,
vehicleQuery.model,
vehicleQuery.year

);

}



/* SEARCH PRODUCTS */

let results = [];

if(vehicleQuery){

const {part,make,model,year} = vehicleQuery;

results = fitmentSearch(

part,
make,
model,
year,
productIndex

);

}



/* FALLBACK SEARCH */

if(!results || results.length===0){

results = fastProductSearch(

enhancedMessage,
productIndex

);

}



/* SEND PRODUCT CARDS */

res.type("text/xml");

return res.send(

sendProductCards(results)

);

});



/* ----------------------------- */
/* ROOT ROUTE                    */
/* ----------------------------- */

app.get("/",(req,res)=>{

res.send("ndestore Automotive AI Running");

});



/* ----------------------------- */
/* ADMIN REPORT                  */
/* ----------------------------- */

app.get("/admin/report",(req,res)=>{

const reportFile = path.join(DATA_DIR,"daily_ai_reports.log");

if(!fs.existsSync(reportFile)){

return res.send("No reports yet");

}

const report = fs.readFileSync(reportFile,"utf8");

res.send(report);

});



/* ----------------------------- */
/* ADMIN CUSTOMERS               */
/* ----------------------------- */

app.get("/admin/customers",(req,res)=>{

const file = path.join(DATA_DIR,"customer_behavior.json");

if(!fs.existsSync(file)){

return res.send([]);

}

res.json(JSON.parse(fs.readFileSync(file)));

});



/* ----------------------------- */
/* ADMIN LIVE CHATS              */
/* ----------------------------- */

app.get("/admin/chats",(req,res)=>{

const file = path.join(DATA_DIR,"live_agent_queue.json");

if(!fs.existsSync(file)){

return res.send([]);

}

res.json(JSON.parse(fs.readFileSync(file)));

});



/* ----------------------------- */
/* SYSTEM INITIALIZATION         */
/* ----------------------------- */

async function initializeSystem(){

console.log("Starting ndestore Automotive AI...");

if(!fs.existsSync(DATA_DIR)){

fs.mkdirSync(DATA_DIR);

}

/* SHOPIFY SYNC */

await syncShopifyCatalog();

/* LOAD INDEX */

loadProductIndex();

/* LOAD VEHICLE DB */

loadVehicleDatabase();

/* LOAD VEHICLE MEMORY */

loadVehicleMemory();

console.log("Vehicle intelligence loaded");

}



initializeSystem();



/* ----------------------------- */
/* START SERVER                  */
/* ----------------------------- */

app.listen(PORT,()=>{

console.log("Server running on port",PORT);

});
