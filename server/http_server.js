import express from "express"
import cors from "cors"

import whatsappWebhook from "../routes/whatsapp_webhook.js"
import dashboardApi from "../routes/admin_dashboard_api.js"
import { syncShopifyProducts } from "../sync/shopify_sync.js"

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/webhook", whatsappWebhook)
app.use("/dashboard", dashboardApi)

async function startServices() {

    try {

        console.log("Starting Shopify sync...")
        await syncShopifyProducts()

    } catch (err) {

        console.log("Shopify startup sync failed:", err.message)

    }

}

startServices()

export default app
