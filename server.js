import express from "express";
import dotenv from "dotenv";

import whatsappWebhook from "./routes/whatsapp_webhook.js";
import startShopifySync from "./services/shopify_sync.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Root route */
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});

/* Shopify app route */
app.get("/app", (req, res) => {
  res.send("NDE Automotive AI Shopify App Loaded");
});

/* Health check */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ndestore Automotive AI",
    time: new Date()
  });
});

/* WhatsApp webhook */
app.post("/webhook", whatsappWebhook);

app.listen(PORT, async () => {
  console.log(`NDE Automotive AI running on port ${PORT}`);
  await startShopifySync();
});
