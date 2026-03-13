const express = require("express")

const vehicleLearning =
require("./ai/vehicle_learning_engine")

const twilioWebhook =
require("./ai/twilio_webhook")

const adminReport =
require("./ai/admin_whatsapp_report")

const reportScheduler =
require("./ai/admin_auto_report_scheduler")

try{

require("./ai/search_index_builder")

}catch(err){

console.log("Product index builder skipped:",err.message)

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

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
