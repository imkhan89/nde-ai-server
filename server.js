import express from "express";
import whatsappRouter from "./routes/whatsapp_webhook.js";

const app = express();
const PORT = process.env.PORT || 8080;

/* Twilio sends application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ndestore Automotive AI",
    time: new Date().toISOString()
  });
});

app.use("/webhook", whatsappRouter);

app.listen(PORT, () => {
  console.log(`NDE Automotive AI running on port ${PORT}`);
});
