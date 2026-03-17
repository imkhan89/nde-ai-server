import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
});

app.use(limiter);

// ✅ Webhook Route (FINAL CORRECT PATH)
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
