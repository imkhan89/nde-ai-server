require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000



// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {

  res.send("NDESTORE Automotive AI Server Running")

})



// =====================================
// WHATSAPP WEBHOOK (TWILIO)
// =====================================

app.post("/whatsapp", async (req, res) => {

  console.log("================================")
  console.log("WhatsApp webhook triggered")
  console.log("Request Body:")
  console.log(req.body)
  console.log("================================")

  const incomingMessage = req.body.Body || ""
  const sender = req.body.From || ""

  console.log("Customer Message:", incomingMessage)
  console.log("Sender:", sender)

  const message = incomingMessage.toLowerCase()

  let reply =
    "Welcome to ndestore.com 🚗\n\nSend request in this format:\n\nPart + Make + Model + Year\n\nExample:\nWiper Blade Suzuki Swift 2022"



  // =====================================
  // SIMPLE INTENT DETECTION
  // =====================================

  if (message.includes("wiper")) {

    reply =
      "Please share your vehicle Make, Model and Year to find correct wiper blades.\n\nExample:\nSuzuki Swift 2021"

  }

  else if (message.includes("brake")) {

    reply =
      "Please share your vehicle Make Model and Year to find correct brake pads."

  }

  else if (message.includes("filter")) {

    reply =
      "Please share your vehicle Make Model and Year to find the correct filter."

  }

  else if (message.includes("hello") || message.includes("hi")) {

    reply =
      "Welcome to ndestore.com 🚗\n\n1 Auto Parts\n2 Accessories\n3 Decal Stickers\n4 Order Status\n5 Support\n6 Complaints\n\nReply with a number to continue."

  }



  console.log("Reply:", reply)



  // =====================================
  // TWILIO RESPONSE (TWiML)
  // =====================================

  res.set("Content-Type", "text/xml")

  res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`)

})



// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

  console.log("================================")
  console.log("NDESTORE AI Server Started")
  console.log("Port:", PORT)
  console.log("Webhook Endpoint: /whatsapp")
  console.log("================================")

})
