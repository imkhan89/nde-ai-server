import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import whatsappWebhook from "../routes/whatsapp_webhook.js";
import healthRoute from "../routes/health.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    name: "ndestore.com Automotive AI",
    status: "running"
  });
});

app.use("/", healthRoute);

app.use("/", whatsappWebhook);

export default app;
