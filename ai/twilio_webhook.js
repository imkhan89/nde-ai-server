/* =====================================================
TWILIO WHATSAPP WEBHOOK
Receives WhatsApp messages and sends AI replies
===================================================== */

const express = require("express")
const bodyParser = require("body-parser")
const { handleCustomerMessage } = require("./chat_handler")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* =====================================================
TWILIO MESSAGE ENDPOINT
===================================================== */

app.post("/whatsapp", async (req, res) => {

try {

const incomingMsg = req.body.Body || ""
const sender = req.body.From || ""

if(!incomingMsg){

return res.send("<Response></Response>")

}

const reply = await handleCustomerMessage(incomingMsg)

const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`

res.set("Content-Type", "text/xml")
res.send(twiml)

} catch(err){

const twiml = `
<Response>
<Message>Sorry, something went wrong. Please try again.</Message>
</Response>
`

res.set("Content-Type", "text/xml")
res.send(twiml)

}

})


/* =====================================================
SERVER START
===================================================== */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

console.log("Twilio WhatsApp webhook running on port " + PORT)

})
