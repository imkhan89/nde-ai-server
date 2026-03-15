import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import whatsappWebhook from "../routes/whatsapp_webhook.js";
import dashboardApi from "../routes/admin_dashboard_api.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
========================
SYSTEM STATUS ROUTES
========================
*/

app.get("/", (req, res) => {
  res.json({
    name: "ndestore.com Automotive AI",
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ndestore.com Automotive AI",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

/*
========================
WHATSAPP WEBHOOK
========================
*/

app.use("/", whatsappWebhook);

/*
========================
DASHBOARD API
========================
*/

app.use("/", dashboardApi);

/*
========================
SERVE DASHBOARD UI
========================
*/

app.use("/dashboard", express.static("public/dashboard"));

export default app;
