import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp_webhook.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root health check
app.get("/", (req, res) => {
  res.send("NDE WhatsApp AI server running");
});

// WhatsApp webhook endpoint
app.use("/webhook", whatsappWebhook);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
