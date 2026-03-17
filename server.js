import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp_webhook.js";

dotenv.config();

// ✅ REQUIRED ENV VARIABLES CHECK
const requiredEnv = [
  "WHATSAPP_TOKEN",
  "PHONE_NUMBER_ID",
  "VERIFY_TOKEN",
  "SHOPIFY_STORE",
  "SHOPIFY_ACCESS_TOKEN"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ENV: ${key}`);
    process.exit(1);
  }
});

const app = express();

// Middleware
app.use(express.json());

// ✅ Webhook Route
app.use("/webhook/whatsapp", whatsappWebhook);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
