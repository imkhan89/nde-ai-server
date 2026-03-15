import 'dotenv/config'

import express from "express"
import cors from "cors"

import whatsappWebhook from "../routes/whatsapp_webhook.js"
import dashboardApi from "../routes/admin_dashboard_api.js"

import { syncShopifyProducts } from "../sync/shopify_sync.js"

const app = express()

app.use(cors())
app.use(express.json())

/*
Routes
*/

app.use("/webhook", whatsappWebhook)
app.use("/dashboard", dashboardApi)

/*
Start Shopify Sync
*/

async function startServer() {

    console.log("Starting Shopify sync...")

    await syncShopifyProducts()

    const PORT = process.env.PORT || 8080

    app.listen(PORT, () => {

        console.log(`ndestore.com Automotive AI running on port ${PORT}`)

    })

}

startServer()
