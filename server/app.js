require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const { loadDatabase } = require("../fitmentService");
const webhook = require("../routes/webhook");

const app = express();

app.use(bodyParser.json());

app.use("/webhook", webhook);

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 3000;

// ✅ FIXED START (WAIT FOR DB)
async function start() {
  try {
    await loadDatabase();

    app.listen(PORT, () => {
      console.log("🚀 Server running on port", PORT);
    });

  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

start();
