// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const sendWhatsAppMessage = require("../../integrations/whatsapp");

// -----------------------------
// 🔐 VERIFY WEBHOOK (META)
// -----------------------------
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// -----------------------------
// 📩 RECEIVE MESSAGES
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const userInput = message.text?.body;

    // -----------------------------
    // 🧠 SIMPLE VEHICLE EXTRACTION (TEMP)
    // Replace later with parser.js
    // -----------------------------
    const vehicle = {
      make: "suzuki",
      model: "swift",
      year: "2021"
    };

    // -----------------------------
    // 🔍 MATCH PRODUCTS
    // -----------------------------
    const products = await matchProducts(userInput, vehicle);

    // -----------------------------
    // 🧾 FORMAT RESPONSE
    // -----------------------------
    let reply = formatResponse(products);

    // Low confidence fallback (optional enhancement later)
    if (!products.length) {
      reply = "Please confirm your car model, year, and part required.";
    }

    // -----------------------------
    // 📤 SEND WHATSAPP MESSAGE
    // -----------------------------
    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
