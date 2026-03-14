const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const twilio = require("twilio")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

// -----------------------------
// Utility Functions
// -----------------------------

function normalizeText(text) {
  if (!text) return ""
  return text.toLowerCase().trim()
}

function detectVehicle(message) {
  const vehicles = [
    "swift",
    "cultus",
    "mehran",
    "alto",
    "civic",
    "city",
    "corolla",
    "yaris",
    "sportage",
    "elantra",
    "sonata"
  ]

  for (const v of vehicles) {
    if (message.includes(v)) {
      return v
    }
  }

  return null
}

function detectProduct(message) {
  const parts = [
    "wiper",
    "wiper blade",
    "air filter",
    "oil filter",
    "cabin filter",
    "brake pad",
    "brake pads",
    "brake shoe",
    "spark plug",
    "coolant",
    "horn"
  ]

  for (const p of parts) {
    if (message.includes(p)) {
      return p
    }
  }

  return null
}

// -----------------------------
// Shopify Product Search
// -----------------------------

async function searchProducts(query) {
  try {
    const shop = process.env.SHOPIFY_STORE
    const token = process.env.SHOPIFY_TOKEN

    const url = `https://${shop}/admin/api/2024-01/products.json?limit=20`

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
      }
    })

    const products = response.data.products || []

    const results = products.filter(p =>
      p.title.toLowerCase().includes(query)
    )

    return results.slice(0, 3)
  } catch (err) {
    console.error("Shopify search error:", err.message)
    return []
  }
}

// -----------------------------
// AI Message Processor
// -----------------------------

async function processMessage(message) {
  const text = normalizeText(message)

  const vehicle = detectVehicle(text)
  const product = detectProduct(text)

  if (!vehicle && product) {
    return "Please share vehicle make, model and year."
  }

  if (vehicle && !product) {
    return "Please tell which part you are looking for."
  }

  if (!vehicle && !product) {
    return "Please send vehicle and part name. Example: Swift wiper blade"
  }

  const query = `${vehicle} ${product}`

  const products = await searchProducts(query)

  if (!products.length) {
    return "No matching product found. Please send full vehicle details."
  }

  let reply = `Results for ${vehicle} ${product}:\n\n`

  products.forEach(p => {
    reply += `${p.title}\n`
    reply += `${process.env.STORE_URL}/products/${p.handle}\n\n`
  })

  return reply
}

// -----------------------------
// WhatsApp Webhook Handler
// -----------------------------

async function handleWebhook(req, res) {
  try {
    const incoming = req.body.Body || ""

    console.log("Incoming message:", incoming)

    const replyText = await processMessage(incoming)

    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message(replyText)

    res.writeHead(200, { "Content-Type": "text/xml" })
    res.end(twiml.toString())
  } catch (error) {
    console.error("Webhook error:", error)

    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message("System error. Please try again.")

    res.writeHead(200, { "Content-Type": "text/xml" })
    res.end(twiml.toString())
  }
}

// -----------------------------
// Routes
// -----------------------------

app.post("/whatsapp", handleWebhook)
app.post("/webhook", handleWebhook)

app.get("/", (req, res) => {
  res.send("ndestore Automotive AI Server Running")
})

// -----------------------------
// Start Server
// -----------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
