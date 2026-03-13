const express = require("express")

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

try{

require("./ai/search_index_builder")

}catch(err){

console.log("Product index builder skipped:",err.message)

}

try{

urlValidator.validateUrls()

}catch(err){

console.log("URL validation skipped:",err.message)

}

try{

globalVehicleDB.loadVehicleDatabase()

}catch(err){

console.log("Global vehicle database load failed:",err.message)

}

try{

compatibilityEngine.loadFitmentDatabase()

console.log("Fitment compatibility database loaded")

}catch(err){

console.log("Fitment database load failed:",err.message)

}

try{

if(vehicleLearning &&
typeof vehicleLearning.learnFromProducts === "function"){

vehicleLearning.learnFromProducts()

console.log("Vehicle intelligence loaded")

}

}catch(err){

console.log("Vehicle learning skipped:",err.message)

}

const app = express()

app.get("/",(req,res)=>{

res.send("ndestore AI Server Running")

})

app.use("/",twilioWebhook)

app.use("/",adminReport)

try{

reportScheduler.startScheduler()

console.log("AI report scheduler started")

}catch(err){

console.log("Report scheduler failed:",err.message)

}

try{

agentAlertEngine.startAgentAlertEngine()

console.log("Agent alert engine started")

}catch(err){

console.log("Agent alert engine failed:",err.message)

}

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
