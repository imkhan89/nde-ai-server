import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp_webhook.js";

dotenv.config();

const app = express();

app.use(express.json());

// ✅ FIX: HANDLE BOTH ROUTES
app.use("/webhook", whatsappWebhook);
app.use("/webhook/whatsapp", whatsappWebhook);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
