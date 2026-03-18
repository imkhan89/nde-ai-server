// server/app.js

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const webhookRoute = require("./routes/webhook");
const productRoute = require("./routes/productRoute");

const app = express();

// -----------------------------
// 🔧 MIDDLEWARE
// -----------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------
// 📡 ROUTES
// -----------------------------

// WhatsApp Webhook
app.use("/webhook", webhookRoute);

// Product Matching API
app.use("/api/products", productRoute);

// -----------------------------
// 🏠 ROOT
// -----------------------------
app.get("/", (req, res) => {
  res.send("NDESTORE AI WhatsApp Commerce सिस्टम is running 🚀");
});

// -----------------------------
// 🚀 SERVER START
// -----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
