import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp_webhook.js";

dotenv.config();

const app = express();

app.use(express.json());

// ✅ ONLY CHECK WHATSAPP ENVS
const requiredEnv = [
  "WHATSAPP_TOKEN",
  "PHONE_NUMBER_ID",
  "VERIFY_TOKEN"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ENV: ${key}`);
  }
});

// ✅ Webhook Route
app.use("/webhook/whatsapp", whatsappWebhook);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
