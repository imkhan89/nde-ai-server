import express from "express";
import dotenv from "dotenv";
import whatsappRouter from "./routes/whatsapp_webhook.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

/* Twilio sends form encoded data */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Register webhook route */
app.use("/webhook", whatsappRouter);

/* Root test route */
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});

app.listen(PORT, () => {
  console.log(`ndestore.com Automotive AI running on port ${PORT}`);
});
