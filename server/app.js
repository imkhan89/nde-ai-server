require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const { loadDatabase } = require("../fitmentService");
const webhookRoute = require("../routes/webhook");
const productRoute = require("../routes/productRoute");

const app = express();

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));

app.use("/webhook/whatsapp", webhookRoute);
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.send("NDE AI fitment server is running");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok"
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await loadDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
