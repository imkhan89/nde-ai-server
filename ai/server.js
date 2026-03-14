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
// WHATSAPP WEBHOOK
// =====================================

app.post("/webhook", async (req, res) => {

  console.log("====================================")
  console.log("Webhook hit")
  console.log("Incoming Request Body:")
  console.log(req.body)
  console.log("====================================")

  const incomingMessage = req.body.Body || ""
  const sender = req.body.From || ""

  console.log("Customer Message:", incomingMessage)
  console.log("From:", sender)

  const message = incomingMessage.toLowerCase()

  let reply = "Welcome to ndestore.com automotive assistant.\n\nPlease send your request in this format:\n\nPart + Make + Model + Year\n\nExample:\nWiper Blade Suzuki Swift 2022"



  // ============================
  // BASIC INTENT DETECTION
  // ============================

  if (message.includes("wiper")) {

    reply =
      "Please share your vehicle details to find the correct wiper blades.\n\nExample:\nSuzuki Swift 2021"

  }

  else if (message.includes("brake")) {

    reply =
      "Please share your vehicle Make Model and Year to find the correct brake pads."

  }

  else if (message.includes("filter")) {

    reply =
      "Please share your vehicle Make Model and Year to find the correct filters."

  }

  else if (message.includes("hello") || message.includes("hi")) {

    reply =
      "Welcome to ndestore.com 🚗\n\n1️⃣ Auto Parts\n2️⃣ Accessories\n3️⃣ Decal Stickers\n4️⃣ Order Status\n5️⃣ Support\n6️⃣ Complaints\n\nReply with a number to continue."

  }



  console.log("AI Reply:", reply)



  // =====================================
  // TWILIO RESPONSE (THIS SENDS WHATSAPP MESSAGE)
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

  console.log("====================================")
  console.log("NDESTORE Automotive AI Server Started")
  console.log("Port:", PORT)
  console.log("Webhook URL: /webhook")
  console.log("====================================")

})
