import express from "express"
import cors from "cors"

import whatsappWebhook from "../routes/whatsapp_webhook.js"
import dashboardApi from "../routes/admin_dashboard_api.js"
import { syncShopifyProducts } from "../sync/shopify_sync.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/webhook", whatsappWebhook)
app.use("/dashboard", dashboardApi)

async function startServer() {

    console.log("Starting Shopify sync...")
    await syncShopifyProducts()

}

startServer()

export default app
