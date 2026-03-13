require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const { syncShopifyCatalog } = require("./ai/shopify_catalog_sync_engine");
const { parseVehicleQuery } = require("./ai/vehicle_query_parser");
const { fastProductSearch } = require("./ai/fast_product_search_engine");
const { fitmentSearch } = require("./ai/vehicle_fitment_search_engine");
const { generateServiceKit } = require("./ai/service_kit_ai_engine");
const { detectComplaint } = require("./ai/complaint_engine");
const { alertAgent } = require("./ai/agent_alert_engine");

const {
  loadVehicleMemory,
  rememberVehicle,
  applyCustomerVehicle
} = require("./ai/vehicle_memory_engine");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, "data");

const PRODUCT_INDEX_FILE = path.join(DATA_DIR, "product_index.json");
const VEHICLE_DB_FILE = path.join(DATA_DIR, "global_vehicle_database.json");

let productIndex = [];
let vehicleDB = [];

const PORT = process.env.PORT || 8080;



/* ------------------------------------------------ */
/* LOAD DATA                                        */
/* ------------------------------------------------ */

function loadProductIndex() {

  try {

    if (!fs.existsSync(PRODUCT_INDEX_FILE)) {
      console.log("Product index missing");
      return;
    }

    const data = fs.readFileSync(PRODUCT_INDEX_FILE);

    productIndex = JSON.parse(data);

    console.log("Fast product search index loaded:", productIndex.length);

  } catch (err) {

    console.log("Product index load error");

  }

}


function loadVehicleDatabase() {

  try {

    if (!fs.existsSync(VEHICLE_DB_FILE)) {
      console.log("Vehicle database missing");
      return;
    }

    const data = fs.readFileSync(VEHICLE_DB_FILE);

    vehicleDB = JSON.parse(data);

    console.log("Global vehicle database loaded");

  } catch (err) {

    console.log("Vehicle database load error");

  }

}



/* ------------------------------------------------ */
/* RESPONSE FORMATTERS                              */
/* ------------------------------------------------ */

function formatProductResults(products) {

  if (!products || products.length === 0) {

    return `No matching products found.

Send request in this format:

Part + Make + Model + Year

Example:
Brake Pads Toyota Corolla 2018`;

  }

  let response = `Top Matching Products\n\n`;

  products.slice(0,5).forEach((p,i)=>{

    response += `${i+1} ${p.title}\n${p.url}\n\n`;

  });

  return response;

}



function formatServiceKit(kit){

  if(!kit || kit.length === 0) return "";

  let text = "\nRecommended Service Kit\n\n";

  kit.forEach(item => {

    text += `• ${item}\n`;

  });

  return text;

}



function mainMenu(){

return `Welcome to ndestore.com

Choose an option:

1 Auto Parts
2 Accessories
3 Decal Stickers
4 Order Status
5 Support
6 Complaints

Reply with a number to continue.`;

}



/* ------------------------------------------------ */
/* TWILIO WHATSAPP WEBHOOK                          */
/* ------------------------------------------------ */

app.post("/twilio/webhook", async (req,res)=>{

  const message = (req.body.Body || "").trim();
  const from = req.body.From || "";

  console.log("Incoming message:", message);



  /* SHOW MENU */

  if(message.toLowerCase() === "menu"){

    return res.send(mainMenu());

  }



  /* COMPLAINT DETECTION */

  if(detectComplaint(message)){

    await alertAgent(from,message);

    return res.send(`Your complaint has been received.

Our support team will contact you shortly.

Support
+92 308 7643288`);

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



  let results = [];



  /* FITMENT SEARCH */

  if(vehicleQuery){

    const { part, make, model, year } = vehicleQuery;

    console.log("Parsed vehicle:",vehicleQuery);

    results = fitmentSearch(
      part,
      make,
      model,
      year,
      productIndex
    );

  }



  /* FALLBACK SEARCH */

  if(!results || results.length === 0){

    results = fastProductSearch(
      enhancedMessage,
      productIndex
    );

  }



  /* SERVICE KIT */

  let serviceKit = [];

  if(vehicleQuery){

    serviceKit = generateServiceKit(vehicleQuery.part);

  }



  let reply = formatProductResults(results);

  reply += formatServiceKit(serviceKit);



  res.send(reply);

});



/* ------------------------------------------------ */
/* ROOT ROUTE                                       */
/* ------------------------------------------------ */

app.get("/",(req,res)=>{

  res.send("ndestore Automotive AI Running");

});



/* ------------------------------------------------ */
/* ADMIN ENDPOINTS                                  */
/* ------------------------------------------------ */

app.get("/admin/report",(req,res)=>{

  const reportFile = path.join(DATA_DIR,"daily_ai_reports.log");

  if(!fs.existsSync(reportFile)){

    return res.send("No reports yet");

  }

  const report = fs.readFileSync(reportFile,"utf8");

  res.send(report);

});



app.get("/admin/customers",(req,res)=>{

  const file = path.join(DATA_DIR,"customer_behavior.json");

  if(!fs.existsSync(file)){

    return res.send([]);

  }

  const data = JSON.parse(fs.readFileSync(file));

  res.json(data);

});



app.get("/admin/chats",(req,res)=>{

  const file = path.join(DATA_DIR,"live_agent_queue.json");

  if(!fs.existsSync(file)){

    return res.send([]);

  }

  const data = JSON.parse(fs.readFileSync(file));

  res.json(data);

});



/* ------------------------------------------------ */
/* SYSTEM INITIALIZATION                            */
/* ------------------------------------------------ */

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



  /* LOAD CUSTOMER VEHICLE MEMORY */

  loadVehicleMemory();



  console.log("Vehicle intelligence loaded");

}



initializeSystem();



/* ------------------------------------------------ */
/* SERVER START                                     */
/* ------------------------------------------------ */

app.listen(PORT,()=>{

  console.log("Server running on port",PORT);

});
