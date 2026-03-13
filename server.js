const express = require("express")

/* CORE AI MODULES */

const vehicleLearning =
require("./ai/vehicle_learning_engine")

const twilioWebhook =
require("./ai/twilio_webhook")

const adminReport =
require("./ai/admin_whatsapp_report")

const reportScheduler =
require("./ai/admin_auto_report_scheduler")

const agentAlertEngine =
require("./ai/agent_alert_engine")

const urlValidator =
require("./ai/product_url_validator")

const globalVehicleDB =
require("./ai/global_vehicle_database")

const compatibilityEngine =
require("./ai/compatibility_prediction_engine")

const fastSearch =
require("./ai/fast_product_search_engine")

const shopifySync =
require("./ai/shopify_catalog_sync_engine")

/* PRODUCT INDEX BUILDER */

try{

require("./ai/search_index_builder")

}catch(err){

console.log("Product index builder skipped:",err.message)

}

/* VALIDATE PRODUCT URLS */

try{

urlValidator.validateUrls()

}catch(err){

console.log("URL validation skipped:",err.message)

}

/* LOAD VEHICLE DATABASE */

try{

globalVehicleDB.loadVehicleDatabase()

}catch(err){

console.log("Global vehicle database load failed:",err.message)

}

/* LOAD FITMENT DATABASE */

try{

compatibilityEngine.loadFitmentDatabase()

console.log("Fitment compatibility database loaded")

}catch(err){

console.log("Fitment database load failed:",err.message)

}

/* LOAD FAST PRODUCT SEARCH */

try{

fastSearch.loadProductIndex()

}catch(err){

console.log("Fast search engine load failed:",err.message)

}

/* VEHICLE INTELLIGENCE TRAINING */

try{

if(vehicleLearning &&
typeof vehicleLearning.learnFromProducts === "function"){

vehicleLearning.learnFromProducts()

console.log("Vehicle intelligence loaded")

}

}catch(err){

console.log("Vehicle learning skipped:",err.message)

}

/* EXPRESS SERVER */

const app = express()

/* ROOT ENDPOINT */

app.get("/",(req,res)=>{

res.send("ndestore Automotive AI Server Running")

})

/* SHOPIFY CATALOG SYNC TEST ROUTE */

app.get("/sync-shopify",async(req,res)=>{

try{

await shopifySync.syncCatalog()

res.send("Shopify catalog sync completed")

}catch(err){

res.send("Shopify sync failed")

}

})

/* WHATSAPP WEBHOOK */

app.use("/",twilioWebhook)

/* ADMIN REPORT ENDPOINT */

app.use("/",adminReport)

/* START REPORT SCHEDULER */

try{

reportScheduler.startScheduler()

console.log("AI report scheduler started")

}catch(err){

console.log("Report scheduler failed:",err.message)

}

/* START AGENT ALERT SYSTEM */

try{

agentAlertEngine.startAgentAlertEngine()

console.log("Agent alert engine started")

}catch(err){

console.log("Agent alert engine failed:",err.message)

}

/* START SERVER */

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
