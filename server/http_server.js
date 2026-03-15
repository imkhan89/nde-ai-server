import express from "express"
import cors from "cors"

import whatsappWebhook from "../routes/whatsapp_webhook.js"
import dashboardApi from "../routes/admin_dashboard_api.js"
import { syncShopifyProducts } from "../sync/shopify_sync.js"

const app = express()

app.use(cors())

// Twilio sends data as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use("/webhook", whatsappWebhook)
app.use("/dashboard", dashboardApi)

async function startServices() {

    try {

        console.log("Starting Shopify sync...")

        await syncShopifyProducts()

        console.log("Shopify Sync Complete")

    } catch (err) {

        console.error("Shopify startup sync failed:", err.message)

    }

}

/*
Run Shopify sync AFTER server start
so WhatsApp webhook replies instantly
*/

setTimeout(() => {

    startServices()

}, 2000)

export default app
