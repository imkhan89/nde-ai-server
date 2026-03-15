import express from "express";
import dotenv from "dotenv";

import whatsappWebhook from "./routes/whatsapp_webhook.js";
import startShopifySync from "./services/shopify_sync.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* Twilio body format */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Start Shopify Sync */
startShopifySync();

/* WhatsApp webhook */
app.use("/webhook", whatsappWebhook);

app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});

app.listen(PORT, () => {
  console.log(`ndestore.com Automotive AI running on port ${PORT}`);
});
