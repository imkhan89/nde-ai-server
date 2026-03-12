const express = require("express")

const twilioWebhook = require("./ai/twilio_webhook")

const app = express()

app.get("/",(req,res)=>{

res.send("ndestore AI Server Running")

})

app.use("/",twilioWebhook)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
