import express from "express";
import dotenv from "dotenv";

import whatsappWebhook from "./routes/whatsapp_webhook.js";
import startShopifySync from "./services/shopify_sync.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/*
---------------------------------------
Middleware
---------------------------------------
*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
---------------------------------------
Root Route (Shopify loads this)
---------------------------------------
*/
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});

/*
---------------------------------------
Shopify App Route
---------------------------------------
*/
app.get("/app", (req, res) => {
  res.send("NDE Automotive AI Shopify App Loaded");
});

/*
---------------------------------------
Health Check Route
---------------------------------------
*/
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ndestore Automotive AI",
    time: new Date()
  });
});

/*
---------------------------------------
WhatsApp Webhook (Twilio)
---------------------------------------
*/
app.use("/webhook", whatsappWebhook);

/*
---------------------------------------
Start Server
---------------------------------------
*/
app.listen(PORT, async () => {

  console.log(`NDE Automotive AI running on port ${PORT}`);

  /*
  ---------------------------------------
  Shopify Sync Startup
  ---------------------------------------
  */

  try {

    if (
      process.env.SHOPIFY_API_KEY &&
      process.env.SHOPIFY_API_SECRET &&
      process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_ADMIN_API_TOKEN
    ) {

      console.log("Starting Shopify product sync...");
      await startShopifySync();

    } else {

      console.log("Shopify sync skipped (credentials not configured)");

    }

  } catch (error) {

    console.error("Shopify sync failed:", error);

  }

});
