const express = require("express")

const vehicleLearning =
require("./ai/vehicle_learning_engine")

const twilioWebhook =
require("./ai/twilio_webhook")

/* START VEHICLE LEARNING */

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

app.get("/",(req,res)=>{

res.send("ndestore AI Server Running")

})

/* TWILIO WEBHOOK */

app.use("/",twilioWebhook)

/* START SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
