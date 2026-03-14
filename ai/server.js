require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000



// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("NDESTORE WhatsApp AI Running")
})



// WHATSAPP WEBHOOK
app.post("/whatsapp", async (req, res) => {

  console.log("===== WHATSAPP WEBHOOK =====")
  console.log(req.body)

  const message = req.body.Body || ""
  const sender = req.body.From || ""

  console.log("Message:", message)
  console.log("Sender:", sender)

  let reply = "Welcome to ndestore.com 🚗"

  const text = message.toLowerCase()

  if(text.includes("wiper")){
    reply = "Please share your vehicle Make Model and Year.\n\nExample:\nSuzuki Swift 2021"
  }

  if(text.includes("hello") || text.includes("hi")){
    reply = "Welcome to ndestore.com\n\n1 Auto Parts\n2 Accessories\n3 Decals\n4 Order Status\n5 Support"
  }

  res.set("Content-Type", "text/xml")

  res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`)

})



// START SERVER
app.listen(PORT, () => {
  console.log("=================================")
  console.log("NDESTORE AI SERVER RUNNING")
  console.log("PORT:", PORT)
  console.log("Webhook: /whatsapp")
  console.log("=================================")
})
