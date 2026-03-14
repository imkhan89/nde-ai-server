const express = require("express")
const bodyParser = require("body-parser")
const twilio = require("twilio")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

// WhatsApp webhook
app.post("/whatsapp", (req, res) => {

  const incomingMessage = req.body.Body || ""

  console.log("Incoming WhatsApp message:", incomingMessage)

  const twiml = new twilio.twiml.MessagingResponse()

  twiml.message("Message received successfully")

  res.writeHead(200, { "Content-Type": "text/xml" })
  res.end(twiml.toString())

})

// Health check
app.get("/", (req, res) => {
  res.send("Server running")
})

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
