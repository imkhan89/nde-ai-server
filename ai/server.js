/* =====================================================
MAIN SERVER
===================================================== */

const express = require("express")
const bodyParser = require("body-parser")

require("./twilio_webhook")

const app = express()

app.use(bodyParser.json())

app.get("/", (req,res)=>{

res.send("Automotive AI Server Running")

})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{

console.log("Server running on port " + PORT)

})
