const express = require("express")
const bodyParser = require("body-parser")
const twilio = require("twilio")

const automotiveAI = require("./ai/automotive_ai")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const MessagingResponse = twilio.twiml.MessagingResponse



app.get("/", (req,res)=>{
res.send("NDE Automotive AI Server Running")
})



app.post("/whatsapp", async (req,res)=>{

const incomingMessage = req.body.Body || ""

console.log("Incoming message:", incomingMessage)

const aiResult = await automotiveAI.processMessage(incomingMessage)

const twiml = new MessagingResponse()

twiml.message(aiResult)

res.writeHead(200, {"Content-Type":"text/xml"})
res.end(twiml.toString())

})



const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
