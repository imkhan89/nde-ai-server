import express from "express"
import bodyParser from "body-parser"
import cron from "node-cron"

import { initDB } from "./database/database.js"
import { processMessage } from "./services/ai_engine.js"
import { syncShopifyProducts } from "./sync/shopify_sync.js"

const app = express()
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initialize database
const db = initDB()

// Shopify initial sync
async function initialSync() {
  try {
    console.log("Starting Shopify product sync...")
    const count = await syncShopifyProducts()
    console.log(`Shopify sync completed: ${count} products`)
  } catch (error) {
    console.error("Shopify sync failed:", error)
  }
}

initialSync()

// Scheduled sync every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Running scheduled Shopify sync...")
  await syncShopifyProducts()
})

// WhatsApp webhook endpoint
app.post("/webhook/whatsapp", async (req, res) => {
  try {

    const message = req.body.Body || ""
    const from = req.body.From || ""

    console.log("Incoming message:", message)

    const reply = await processMessage(message)

    res.set("Content-Type", "text/xml")

    res.send(`
<Response>
<Message>${reply}</Message>
</Response>
    `)

  } catch (error) {

    console.error("Webhook error:", error)

    res.set("Content-Type", "text/xml")

    res.send(`
<Response>
<Message>Sorry, something went wrong.</Message>
</Response>
    `)

  }
})

// Debug endpoint
app.get("/debug/products", (req, res) => {

  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {

    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(row)

  })

})

// Health check
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running")
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
