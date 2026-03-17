import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp_webhook.js";

dotenv.config();

// ✅ WARN ONLY (DO NOT CRASH)
const requiredEnv = [
  "WHATSAPP_TOKEN",
  "PHONE_NUMBER_ID",
  "VERIFY_TOKEN",
  "SHOPIFY_STORE",
  "SHOPIFY_ACCESS_TOKEN"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing ENV: ${key}`);
  }
});

const app = express();

app.use(express.json());

app.use("/webhook/whatsapp", whatsappWebhook);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
