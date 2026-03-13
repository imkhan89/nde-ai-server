const express = require("express")

/* ============================= */
/* LOAD AI MODULES */
/* ============================= */

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

const vehicleFitmentSearch =
require("./ai/vehicle_fitment_search_engine")

const serviceKitAI =
require("./ai/service_kit_ai_engine")

const shopifySync =
require("./ai/shopify_catalog_sync_engine")

/* ============================= */
/* PRODUCT INDEX BUILDER */
/* ============================= */

try{

require("./ai/search_index_builder")

}catch(err){

console.log("Product index builder skipped:",err.message)

}

/* ============================= */
/* VALIDATE PRODUCT URLS */
/* ============================= */

try{

urlValidator.validateUrls()

}catch(err){

console.log("URL validation skipped:",err.message)

}

/* ============================= */
/* LOAD GLOBAL VEHICLE DATABASE */
/* ============================= */

try{

globalVehicleDB.loadVehicleDatabase()

}catch(err){

console.log("Global vehicle database load failed:",err.message)

}

/* ============================= */
/* LOAD FITMENT DATABASE */
/* ============================= */

try{

compatibilityEngine.loadFitmentDatabase()

console.log("Fitment compatibility database loaded")

}catch(err){

console.log("Fitment database load failed:",err.message)

}

/* ============================= */
/* LOAD FAST PRODUCT SEARCH */
/* ============================= */

try{

fastSearch.loadProductIndex()

}catch(err){

console.log("Fast product search load failed:",err.message)

}

/* ============================= */
/* LOAD VEHICLE FITMENT SEARCH */
/* ============================= */

try{

vehicleFitmentSearch.loadIndex()

}catch(err){

console.log("Vehicle fitment search load failed:",err.message)

}

/* ============================= */
/* LOAD SERVICE KIT AI */
/* ============================= */

try{

serviceKitAI.loadIndex()

}catch(err){

console.log("Service kit AI load failed:",err.message)

}

/* ============================= */
/* VEHICLE LEARNING */
/* ============================= */

try{

if(vehicleLearning &&
typeof vehicleLearning.learnFromProducts === "function"){

vehicleLearning.learnFromProducts()

console.log("Vehicle intelligence loaded")

}

}catch(err){

console.log("Vehicle learning skipped:",err.message)

}

/* ============================= */
/* EXPRESS SERVER */
/* ============================= */

const app = express()

app.use(express.json())

/* ROOT */

app.get("/",(req,res)=>{

res.send("ndestore Automotive AI Server Running")

})

/* ============================= */
/* SHOPIFY CATALOG SYNC TEST */
/* ============================= */

app.get("/sync-shopify",async(req,res)=>{

try{

await shopifySync.syncCatalog()

res.send("Shopify catalog sync completed")

}catch(err){

console.log(err)

res.send("Shopify sync failed")

}

})

/* ============================= */
/* FAST PRODUCT SEARCH TEST */
/* ============================= */

app.get("/search",async(req,res)=>{

try{

const query = req.query.q

const result = fastSearch.buildSearchResponse(query)

res.send(result || "No products found")

}catch(err){

res.send("Search failed")

}

})

/* ============================= */
/* VEHICLE FITMENT SEARCH TEST */
/* ============================= */

app.get("/fitment",async(req,res)=>{

try{

const part = req.query.part
const make = req.query.make
const model = req.query.model
const year = req.query.year

const result =
vehicleFitmentSearch.buildFitmentResponse(part,make,model,year)

res.send(result || "No compatible products found")

}catch(err){

res.send("Fitment search failed")

}

})

/* ============================= */
/* SERVICE KIT TEST */
/* ============================= */

app.get("/service-kit",async(req,res)=>{

try{

const make = req.query.make
const model = req.query.model
const year = req.query.year

const result =
serviceKitAI.buildServiceKitResponse(make,model,year)

res.send(result || "No service kit found")

}catch(err){

res.send("Service kit search failed")

}

})

/* ============================= */
/* WHATSAPP WEBHOOK */
/* ============================= */

app.use("/",twilioWebhook)

/* ============================= */
/* ADMIN REPORT ROUTES */
/* ============================= */

app.use("/",adminReport)

/* ============================= */
/* START REPORT SCHEDULER */
/* ============================= */

try{

reportScheduler.startScheduler()

console.log("AI report scheduler started")

}catch(err){

console.log("Report scheduler failed:",err.message)

}

/* ============================= */
/* START AGENT ALERT SYSTEM */
/* ============================= */

try{

agentAlertEngine.startAgentAlertEngine()

console.log("Agent alert engine started")

}catch(err){

console.log("Agent alert engine failed:",err.message)

}

/* ============================= */
/* START SERVER */
/* ============================= */

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
