import express from "express";
import dotenv from "dotenv";

import whatsappWebhook from "./routes/whatsapp_webhook.js";
import startShopifySync from "./services/shopify_sync.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/*
-----------------------------------------
Middleware
-----------------------------------------
*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
-----------------------------------------
Health Check Route
Important for Railway + Shopify
-----------------------------------------
*/
app.get("/", (req, res) => {
  res.status(200).send("NDE Automotive AI Server Running");
});

/*
-----------------------------------------
WhatsApp Webhook Route (Twilio)
-----------------------------------------
*/
app.post("/webhook", whatsappWebhook);

/*
-----------------------------------------
Optional Debug Route
Helps verify Railway deployment
-----------------------------------------
*/
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ndestore Automotive AI",
    time: new Date()
  });
});

/*
-----------------------------------------
Start Server
-----------------------------------------
*/
app.listen(PORT, async () => {
  console.log(`NDE Automotive AI running on port ${PORT}`);

  try {
    await startShopifySync();
    console.log("Shopify sync started successfully");
  } catch (error) {
    console.error("Shopify sync failed:", error);
  }
});
